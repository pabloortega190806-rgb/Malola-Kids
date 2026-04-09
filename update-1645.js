import { Pool } from 'pg';
import 'dotenv/config';

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const newStock = {
    '0-1 Meses (55 cm)': 1,
    '1-2 Meses (60 cm)': 1,
    '2-4 Meses (65 cm)': 1,
    '4-6 Meses (70 cm)': 1
  };

  await pool.query('UPDATE products SET sizes_stock = $1 WHERE code = $2', [JSON.stringify(newStock), '1645.06']);
  console.log("Updated 1645.06");
  await pool.end();
}

run();
