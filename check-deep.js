import pg from "pg";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const { Pool } = pg;

async function getAllCloudinaryImages() {
  try {
    let allResources = [];
    let nextCursor = null;
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor
      });
      allResources.push(...result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);
    
    return allResources.map(res => {
      const filename = res.public_id.split('/').pop();
      const cleanFilename = filename.replace(/_[a-z0-9]{6}$/i, '');
      return {
        pathname: cleanFilename + '.' + (res.format || 'jpg'),
        url: res.secure_url,
        originalName: filename
      };
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  const result = await pool.query('SELECT code, name FROM products');
  const products = result.rows;
  await pool.end();
  
  const allBlobs = await getAllCloudinaryImages();
  
  const missingCodes = [
    "1010.10", "118.41", "3013.11", "3060.72", "3225.59", "3227.68", "3229.72", 
    "3601.18", "3888.39", "1657.78", "1926.56", "3233.80", "3602.23", "3735.49", 
    "1626.58", "1639.71", "1737.82", "62157", "3202.54", "3593.58", "3232.80"
  ];
  
  console.log("--- ANÁLISIS PROFUNDO DE CÓDIGOS FALTANTES ---");
  
  const trulyMissing = [];

  for (const code of missingCodes) {
    const cleanCode = code.replace(/^26[-_]/, '');
    const digitsOnly = cleanCode.replace(/[^0-9]/g, ''); // Ej: 1010.10 -> 101010
    
    let foundByDigits = [];

    for (const blob of allBlobs) {
      const nameWithoutExt = path.basename(blob.pathname, path.extname(blob.pathname)).toLowerCase();
      const blobDigitsOnly = nameWithoutExt.replace(/[^0-9]/g, '');
      
      // 1. Búsqueda por coincidencia exacta de dígitos (ignorando letras, guiones, puntos)
      if (digitsOnly.length > 3 && blobDigitsOnly === digitsOnly) {
        foundByDigits.push(blob.originalName);
      }
      // O si la imagen contiene exactamente esos dígitos seguidos
      else if (digitsOnly.length > 3 && blobDigitsOnly.includes(digitsOnly)) {
         // Verificamos que no sea un número mucho más largo
         if (blobDigitsOnly.length <= digitsOnly.length + 2) {
             foundByDigits.push(blob.originalName);
         }
      }
    }

    if (foundByDigits.length > 0) {
      console.log(`\n⚠️ Código: ${code}`);
      console.log(`   -> Podría ser alguna de estas imágenes (coinciden los números):`);
      foundByDigits.forEach(img => console.log(`      - ${img}`));
    } else {
      trulyMissing.push(code);
    }
  }
  
  console.log(`\n=================================================`);
  console.log(`CÓDIGOS QUE DEFINITIVAMENTE NO TIENEN IMAGEN (${trulyMissing.length}):`);
  console.log(trulyMissing.join(', '));
}

run().catch(console.error);
