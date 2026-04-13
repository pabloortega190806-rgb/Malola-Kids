import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateProduct() {
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1 WHERE code = $2 RETURNING *',
      ['PELELE ATARI CORAL', '32530']
    );
    if (result.rows.length > 0) {
      console.log('Product updated successfully:', result.rows[0]);
    } else {
      console.log('Product with code 32530 not found.');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  } finally {
    await pool.end();
  }
}

updateProduct();
