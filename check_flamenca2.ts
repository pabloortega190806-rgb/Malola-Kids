import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkFlamenca() {
  try {
    const result = await pool.query(
      "SELECT code, name, category, image_url, local_images FROM products WHERE code IN ('302350', '302351', '302352', '302353', '302354', '302355')"
    );
    console.log('Flamenca products:', result.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkFlamenca();
