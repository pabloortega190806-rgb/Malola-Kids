import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configura aquí la URL base de tu Vercel Blob
// Asegúrate de que termine en barra '/'
const BASE_URL_BLOB = process.env.BASE_URL_BLOB || 'https://tu-proyecto.public.blob.vercel-storage.com/';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function syncImages() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL no está definida en las variables de entorno.");
    process.exit(1);
  }

  try {
    console.log("Conectando a la base de datos Neon...");
    
    // 1. Añadir columna gallery_urls si no existe
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb`);
    console.log("✅ Columna gallery_urls verificada/creada en la tabla products.");

    // 2. Obtener todos los productos
    const { rows: products } = await pool.query('SELECT code FROM products');
    console.log(`🔍 Encontrados ${products.length} productos. Verificando imágenes en Vercel Blob...`);
    console.log(`URL Base configurada: ${BASE_URL_BLOB}`);

    for (const product of products) {
      const code = product.code;
      
      // 3. Verificar imagen principal
      const mainImageUrl = `${BASE_URL_BLOB}${code}.jpg`;
      const mainExists = await checkImageExists(mainImageUrl);
      
      let finalImageUrl = mainExists ? mainImageUrl : `${BASE_URL_BLOB}placeholder.jpg`;
      
      // 4. Verificar imágenes de galería (ej. code_1.jpg, code_2.jpg)
      const galleryUrls = [];
      if (mainExists) {
        galleryUrls.push(mainImageUrl);
      }
      
      // Comprobamos hasta 5 imágenes extra por producto para no hacer demasiadas peticiones
      for (let i = 1; i <= 5; i++) {
        const extraImageUrl = `${BASE_URL_BLOB}${code}_${i}.jpg`;
        const extraExists = await checkImageExists(extraImageUrl);
        if (extraExists) {
          galleryUrls.push(extraImageUrl);
        } else {
          // Si no existe la 1, asumimos que no hay 2, 3, etc. para optimizar
          break;
        }
      }

      // 5. Actualizar la base de datos
      await pool.query(
        'UPDATE products SET image_url = $1, gallery_urls = $2 WHERE code = $3',
        [finalImageUrl, JSON.stringify(galleryUrls), code]
      );
      
      console.log(`✅ Producto ${code} actualizado: ${galleryUrls.length} imágenes encontradas.`);
    }

    console.log("🎉 ¡Sincronización completada con éxito!");
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
  } finally {
    await pool.end();
  }
}

syncImages();
