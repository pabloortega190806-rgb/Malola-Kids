import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // 1. Get categories
  const catRes = await pool.query('SELECT DISTINCT category FROM products');
  console.log("Categories:", catRes.rows.map(r => r.category));

  // 2. Update stock to 1 for all sizes
  const prodRes = await pool.query('SELECT code, sizes_stock FROM products');
  let updatedCount = 0;
  for (const row of prodRes.rows) {
    const stock = row.sizes_stock || {};
    let changed = false;
    for (const size in stock) {
      if (stock[size] !== 1) {
        stock[size] = 1;
        changed = true;
      }
    }
    if (changed) {
      await pool.query('UPDATE products SET sizes_stock = $1 WHERE code = $2', [stock, row.code]);
      updatedCount++;
    }
  }
  console.log(`Updated stock to 1 for ${updatedCount} products.`);

  await pool.end();
}

run().catch(console.error);
