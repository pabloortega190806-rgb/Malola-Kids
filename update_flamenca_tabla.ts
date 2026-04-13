import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateFlamenca() {
  try {
    const tablaUrl = 'https://res.cloudinary.com/daom5jnck/image/upload/v1776083740/Tabla_medidas_flamenca_nf9ko2.jpg';
    const missingImageUrl = 'https://res.cloudinary.com/daom5jnck/image/upload/v1776083861/302351_k4zz0c.jpg';

    // 1. Update the missing image for 302351
    await pool.query(
      'UPDATE products SET image_url = $1, local_images = $2 WHERE code = $3',
      [missingImageUrl, JSON.stringify([missingImageUrl]), '302351']
    );
    console.log('Updated image for 302351');

    // 2. Append tablaUrl to local_images for all Flamenca products
    const result = await pool.query("SELECT code, local_images FROM products WHERE category ILIKE '%Flamenca%'");
    
    for (const row of result.rows) {
      let images = [];
      try {
        images = typeof row.local_images === 'string' ? JSON.parse(row.local_images) : (row.local_images || []);
      } catch (e) {
        images = [];
      }
      
      if (!images.includes(tablaUrl)) {
        images.push(tablaUrl);
        await pool.query('UPDATE products SET local_images = $1 WHERE code = $2', [JSON.stringify(images), row.code]);
        console.log(`Added tabla to product ${row.code}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateFlamenca();
