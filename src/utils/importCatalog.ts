import pg from "pg";
import fs from "fs";

const { Pool } = pg;

// Configura tu DATABASE_URL aquí o en el archivo .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("⚠️ DATABASE_URL no está configurada.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Interfaz para los datos de entrada (cada fila del catálogo)
export interface RawProductRow {
  CODIGO: string;
  ARTICULO: string;
  COLOR?: string;
  DESCRIPCION?: string; // Composición
  PVP: number;
  CATEGORIA?: string;
  MARCA: string;
  TALLA: string;
  STOCK: number;
}

export async function processAndInsertCatalog(rows: RawProductRow[]) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Agrupar filas por CÓDIGO
    const productsMap = new Map<string, any>();

    for (const row of rows) {
      const code = row.CODIGO.toString().trim();
      
      if (!productsMap.has(code)) {
        // --- Regla de Categorización por Sufijo ---
        let finalCategory = row.CATEGORIA || 'General';
        const upperCode = code.toUpperCase();
        
        if (upperCode.endsWith('-B')) {
          finalCategory = 'Bebé';
        } else if (upperCode.endsWith('-N')) {
          finalCategory = 'Niños';
        }

        // --- Regla de Precios (40% de descuento) ---
        const originalPrice = Number(row.PVP);
        const discountedPrice = originalPrice * 0.60; // 40% de descuento

        // --- Gestión de Imágenes ---
        // Asumiendo que las imágenes están en un prefijo base de PostImage
        // Se actualizará cuando proporciones el enlace base
        const imageUrl = `https://i.postimg.cc/placeholder/${code}.jpg`; 

        productsMap.set(code, {
          code: code,
          name: row.ARTICULO.trim(),
          description: row.DESCRIPCION ? row.DESCRIPCION.trim() : '',
          color: row.COLOR ? row.COLOR.trim() : '',
          original_price: originalPrice,
          discounted_price: discountedPrice,
          brand: row.MARCA.trim(),
          category: finalCategory,
          sizes_stock: {}, // Se llenará con las variantes
          image_url: imageUrl
        });
      }

      // --- Lógica de Variantes (Tallas y Stock) ---
      const product = productsMap.get(code);
      const size = row.TALLA.toString().trim();
      const stock = Number(row.STOCK) || 0;
      
      // Acumular stock si la talla ya existe, o inicializarla
      if (product.sizes_stock[size]) {
        product.sizes_stock[size] += stock;
      } else {
        product.sizes_stock[size] = stock;
      }
    }

    // 2. Insertar o actualizar en la base de datos
    console.log(`Procesados ${productsMap.size} productos únicos a partir de ${rows.length} filas.`);
    
    for (const product of productsMap.values()) {
      const query = `
        INSERT INTO products (
          code, name, description, color, original_price, discounted_price, 
          brand, category, sizes_stock, image_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          color = EXCLUDED.color,
          original_price = EXCLUDED.original_price,
          discounted_price = EXCLUDED.discounted_price,
          brand = EXCLUDED.brand,
          category = EXCLUDED.category,
          sizes_stock = EXCLUDED.sizes_stock,
          image_url = EXCLUDED.image_url,
          updated_at = CURRENT_TIMESTAMP;
      `;
      
      const values = [
        product.code,
        product.name,
        product.description,
        product.color,
        product.original_price,
        product.discounted_price,
        product.brand,
        product.category,
        JSON.stringify(product.sizes_stock),
        product.image_url
      ];

      await client.query(query, values);
    }

    await client.query('COMMIT');
    console.log('✅ Catálogo importado exitosamente.');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importando el catálogo:', error);
    throw error;
  } finally {
    client.release();
  }
}
