import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateFlamencaImages() {
  const images = {
    '302350': 'https://res.cloudinary.com/daom5jnck/image/upload/v1776080161/302350_zlvmyt.jpg',
    '302352': 'https://res.cloudinary.com/daom5jnck/image/upload/v1776080161/302352_aphtv8.jpg',
    '302353': 'https://res.cloudinary.com/daom5jnck/image/upload/v1776080161/302353_vjrkp9.jpg',
    '302354': 'https://res.cloudinary.com/daom5jnck/image/upload/v1776080161/302354_gcwxv8.jpg',
    '302355': 'https://res.cloudinary.com/daom5jnck/image/upload/v1776080161/302355_vlwuoy.jpg'
  };

  try {
    for (const [code, url] of Object.entries(images)) {
      await pool.query(
        'UPDATE products SET image_url = $1, local_images = $2 WHERE code = $3',
        [url, JSON.stringify([url]), code]
      );
      console.log(`Updated ${code}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateFlamencaImages();
