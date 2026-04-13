import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupProducts() {
  try {
    // 1. Update 32530
    await pool.query(
      'UPDATE products SET name = $1, color = $2 WHERE code = $3',
      ['PELELE ATARI', 'Coral', '32530']
    );
    console.log('Updated 32530');

    // 2. Get 32530 to copy its details
    const res = await pool.query('SELECT * FROM products WHERE code = $1', ['32530']);
    const p = res.rows[0];

    // 3. Insert 32530-BEIG
    const newCode = '32530-BEIG';
    const newImageUrl = 'https://res.cloudinary.com/daom5jnck/image/upload/v1776075157/32530_Beig_cpa8vz.jpg';
    
    // Check if exists
    const checkRes = await pool.query('SELECT code FROM products WHERE code = $1', [newCode]);
    if (checkRes.rows.length === 0) {
      await pool.query(`
        INSERT INTO products (code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url, local_images)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        newCode,
        'PELELE ATARI',
        p.description,
        'Beig',
        p.original_price,
        p.discounted_price,
        p.brand,
        p.category,
        p.sizes_stock,
        newImageUrl,
        JSON.stringify([newImageUrl])
      ]);
      console.log('Inserted 32530-BEIG');
    } else {
      await pool.query(`
        UPDATE products SET name = $1, color = $2, image_url = $3, local_images = $4 WHERE code = $5
      `, [
        'PELELE ATARI',
        'Beig',
        newImageUrl,
        JSON.stringify([newImageUrl]),
        newCode
      ]);
      console.log('Updated 32530-BEIG');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

setupProducts();
