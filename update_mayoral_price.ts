import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateMayoralPrice() {
  try {
    const res = await pool.query(`SELECT code, original_price FROM products WHERE brand = 'Mayoral'`);
    for (const row of res.rows) {
      // The current original_price is 9.98.
      // We want to set both original_price and discounted_price to 60% of that (5.99).
      const currentPrice = parseFloat(row.original_price);
      const newPrice = (currentPrice * 0.6).toFixed(2);

      await pool.query(
        `UPDATE products 
         SET 
           original_price = $1,
           discounted_price = $1
         WHERE code = $2`,
        [newPrice, row.code]
      );
    }
    console.log('Mayoral prices updated successfully.');
  } catch (err) {
    console.error('Error updating Mayoral prices:', err);
  } finally {
    await pool.end();
  }
}

updateMayoralPrice();
