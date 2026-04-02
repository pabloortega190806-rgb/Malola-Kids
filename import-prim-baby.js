import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const rawData = `CÓDIGO	ARTÍCULO	COLOR	CATEGORÍA	TALLA	PRECIO
1214	CONJUNTO BRAGA CANESU TRENZAS	AGUA	BEBE 0-12 MESES	3 MESES	27.90€
1214	CONJUNTO BRAGA CANESU TRENZAS	AGUA	BEBE 0-12 MESES	1 MES	27.90€
1216	CONJUNTO BRAGA PUNTILLA CRISTAL	PIEDRA	BEBE 0-12 MESES	0 MESES	31.90€
1216	CONJUNTO BRAGA PUNTILLA CRISTAL	PIEDRA	BEBE 0-12 MESES	1 MES	31.90€
1216	CONJUNTO BRAGA PUNTILLA CRISTAL	PIEDRA	BEBE 0-12 MESES	3 MESES	31.90€
1218	CONJUNTO BRAGAS BODOQUES COLOR	CRUDO/VERDE	BEBE 0-12 MESES	00 MESES	28.90€
1218	CONJUNTO BRAGAS BODOQUES COLOR	CRUDO/VERDE	BEBE 0-12 MESES	0 MESES	28.90€
1218	CONJUNTO BRAGAS BODOQUES COLOR	CRUDO/VERDE	BEBE 0-12 MESES	1 MES	28.90€
1218	CONJUNTO BRAGAS BODOQUES COLOR	CRUDO/VERDE	BEBE 0-12 MESES	3 MESES	28.90€
1206	CONJUNTO POL. MENGUADO EM BODOQUES	CRUDO/PIEDRA	BEBE 0-12 MESES	0 MESES	29.90€
1206	CONJUNTO POL. MENGUADO EM BODOQUES	CRUDO/PIEDRA	BEBE 0-12 MESES	1 MES	29.90€
1208	CONJUNTO POL. MENGUADO LINKS CALADOS 	PIEDRA	BEBE 0-12 MESES	0 MESES	29.90€
1208	CONJUNTO POL. MENGUADO LINKS CALADOS	PIEDRA	BEBE 0-12 MESES	1 MES	29.90€
1208	CONJUNTO POL. MENGUADO LINKS CALADOS	PIEDRA	BEBE 0-12 MESES	3 MESES	29.90€
1205	CONJUNTO POL. MENGUADO EM BODOQUES	PASTEL	BEBE 0-12 MESES	0 MESES	28.90€
1205	CONJUNTO POL. MENGUADO EM BODOQUES	PASTEL	BEBE 0-12 MESES	1 MES	28.90€
1205	CONJUNTO POL. MENGUADO EM BODOQUES	AGUA	BEBE 0-12 MESES	0 MESES	28.90€
1205	CONJUNTO POL. MENGUADO EM BODOQUES	AGUA	BEBE 0-12 MESES	1 MES	28.90€
1205	CONJUNTO POL. MENGUADO EM BODOQUES	AGUA	BEBE 0-12 MESES	3 MESES	28.90€
1202	CONJUNTO POL TRENZAS CANESU	AMARILLO CLARO	BEBE 0-12 MESES	0 MESES	27.90€
1202	CONJUNTO POL TRENZAS CANESU	AMARILLO CLARO	BEBE 0-12 MESES	1 MES	27.90€
1202	CONJUNTO POL TRENZAS CANESU	AMARILLO CLARO	BEBE 0-12 MESES	3 MESES	27.90€
1208	CONJUNTO POL. MENGUADO LINKS CALADOS	LAGO	BEBE 0-12 MESES	0 MESES	28.90€
1208	CONJUNTO POL. MENGUADO LINKS CALADOS	LAGO	BEBE 0-12 MESES	1 MES	28.90€
1202	CONJUNTO POL TRENZAS CANESU	AZUL INGLES	BEBE 0-12 MESES	0 MESES	27.90€
1202	CONJUNTO POL TRENZAS CANESU	AZUL INGLES	BEBE 0-12 MESES	1 MES	27.90€
1202	CONJUNTO POL TRENZAS CANESU	AZUL INGLES	BEBE 0-12 MESES	3 MESES	27.90€
1264	PELELE PUNTO TELA BORDADA	PIEDRA	BEBE 0-12 MESES	1 MES	39.90€
1264	PELELE PUNTO TELA BORDADA	PIEDRA	BEBE 0-12 MESES	3 MESES	39.90€
1264	PELELE PUNTO TELA BORDADA	PIEDRA	BEBE 0-12 MESES	9 MESES	39.90€
1264	PELELE PUNTO TELA BORDADA	PIEDRA	BEBE 0-12 MESES	12 MESES	39.90€
1265	PELELE PUNTO TELA BORDADA	AZUL	BEBE 0-12 MESES	1 MES	39.90€
1265	PELELE PUNTO TELA BORDADA	AZUL	BEBE 0-12 MESES	3 MESES	39.90€
1265	PELELE PUNTO TELA BORDADA	AZUL	BEBE 0-12 MESES	6 MESES	39.90€
1265	PELELE PUNTO TELA BORDADA	AZUL	BEBE 0-12 MESES	12 MESES	39.90€
1058	PELELE PUNTO TELA DE OCAS	GRIS	BEBE 0-12 MESES	9 MESES	24.90€
1002	CONJUNTO POLAINA MENGUADO	AZUL/ BLANCO	BEBE 0-12 MESES	6 MESES	27.90€
1007	CONJUNTO POLAINA LINKS BOLSILLO	PIEDRA	BEBE 0-12 MESES	6 MESES	26.90€
1003	CONJUNTO POLAINA MENGUADO	ROSA	BEBE 0-12 MESES	3 MESES	24.90€
1003	CONJUNTO POLAINA MENGUADO	ROSA	BEBE 0-12 MESES	6 MESES	24.90€
1017	CONJUNTO BRAGA TACHON	ROSA	BEBE 0-12 MESES	6 MESES	24.90€
1274	MANTA TIRAS DE CALADO	AZUL	BEBE 0-12 MESES	ÚNICA	29.90€
1274	MANTA TIRAS DE CALADO	ROSA	BEBE 0-12 MESES	ÚNICA	29.90€
1273	MANTA TIRAS DE CALADO	TURQUESA	BEBE 0-12 MESES	ÚNICA	29.90€
1274	MANTA TIRAS DE CALADO	VERDE	BEBE 0-12 MESES	ÚNICA	29.90€`;

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const lines = rawData.trim().split('\n');
  const headers = lines[0].split('\t');
  
  const productsMap = new Map();

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length < 6) continue;
    
    const code = parts[0].trim();
    const name = parts[1].trim();
    const color = parts[2].trim();
    const category = parts[3].trim();
    const size = parts[4].trim();
    const priceStr = parts[5].trim().replace('€', '').replace(',', '.');
    const price = parseFloat(priceStr);

    const key = code + "-" + color;
    
    if (!productsMap.has(key)) {
      productsMap.set(key, {
        baseCode: code,
        name,
        color,
        category,
        price,
        brand: 'Prim Baby',
        sizes_stock: {}
      });
    }
    
    productsMap.get(key).sizes_stock[size] = 5;
  }

  const baseCodeCounts = {};
  for (const [key, p] of productsMap.entries()) {
    baseCodeCounts[p.baseCode] = (baseCodeCounts[p.baseCode] || 0) + 1;
  }

  const finalProducts = [];
  for (const [key, p] of productsMap.entries()) {
    let finalCode = p.baseCode;
    if (baseCodeCounts[p.baseCode] > 1) {
      const colorSuffix = p.color.split('/')[0].substring(0, 3).toUpperCase().replace(/\s/g, '');
      finalCode = p.baseCode + "-" + colorSuffix;
    }
    
    finalProducts.push({
      code: finalCode,
      name: p.name,
      description: 'Colección Prim Baby',
      color: p.color,
      original_price: p.price,
      discounted_price: p.price,
      brand: p.brand,
      category: p.category,
      sizes_stock: p.sizes_stock
    });
  }

  console.log("Prepared " + finalProducts.length + " products to insert.");

  for (const p of finalProducts) {
    try {
      await pool.query(
        "INSERT INTO products (code, name, description, color, original_price, discounted_price, brand, category, sizes_stock) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) " +
        "ON CONFLICT (code) DO UPDATE SET " +
        "name = EXCLUDED.name, " +
        "color = EXCLUDED.color, " +
        "sizes_stock = EXCLUDED.sizes_stock, " +
        "original_price = EXCLUDED.original_price, " +
        "discounted_price = EXCLUDED.discounted_price",
        [p.code, p.name, p.description, p.color, p.original_price, p.discounted_price, p.brand, p.category, JSON.stringify(p.sizes_stock)]
      );
      console.log("Inserted/Updated " + p.code + " - " + p.name + " (" + p.color + ")");
    } catch (err) {
      console.error("Error inserting " + p.code + ":", err.message);
    }
  }

  await pool.end();
}

run().catch(console.error);
