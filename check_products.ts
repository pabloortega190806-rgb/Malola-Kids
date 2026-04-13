import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkProducts() {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE name ILIKE '%ATARI%'"
    );
    console.log('Products found:', result.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkProducts();
