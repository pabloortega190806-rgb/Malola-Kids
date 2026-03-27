import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
});

async function seed() {
  try {
    const sql = fs.readFileSync('mayoral_seed.sql', 'utf8');
    await pool.query(sql);
    console.log('Mayoral products seeded successfully!');
  } catch (err) {
    console.error('Error seeding Mayoral products:', err);
  } finally {
    await pool.end();
  }
}

seed();
