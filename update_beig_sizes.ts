import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateSizes() {
  try {
    const sizesStock = {
      '1 Mes ( 54 cm)': 1,
      '3 Meses (60 cm)': 1,
      '6 Meses (67 cm)': 1,
      '12 Meses (74 cm)': 1,
      '18 Meses (81 cm)': 1,
      '24 Meses (86 cm)': 1
    };

    const result = await pool.query(
      'UPDATE products SET sizes_stock = $1 WHERE code = $2 RETURNING *',
      [sizesStock, '32530-BEIG']
    );
    
    if (result.rows.length > 0) {
      console.log('Updated product sizes successfully:', result.rows[0].sizes_stock);
    } else {
      console.log('Product 32530-BEIG not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateSizes();
