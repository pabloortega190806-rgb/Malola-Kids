import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  const result = await pool.query('SELECT * FROM products LIMIT 5');
  console.log(result.rows);
  await pool.end();
}

run().catch(console.error);
