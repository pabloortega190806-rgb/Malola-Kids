import pg from "pg";
import fs from "fs";

const { Pool } = pg;

async function checkAndSeed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("NO_DATABASE_URL");
    return;
  }
  
  console.log("DATABASE_URL_FOUND");
  
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const schemaSql = fs.readFileSync("schema.sql", "utf8");
    await pool.query(schemaSql);
    console.log("SCHEMA_CREATED");
    
    const countRes = await pool.query("SELECT COUNT(*) FROM products");
    const count = parseInt(countRes.rows[0].count);
    
    if (count === 0) {
      console.log("SEEDING_DATA...");
      const sql = fs.readFileSync("catalog_seed.sql", "utf8");
      await pool.query(sql);
      console.log("SEED_SUCCESS");
    } else {
      console.log(`ALREADY_SEEDED_WITH_${count}_PRODUCTS`);
    }
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await pool.end();
  }
}

checkAndSeed();
