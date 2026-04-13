import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupAlboranVariants() {
  try {
    // Get original product to copy details
    const res = await pool.query('SELECT * FROM products WHERE code = $1', ['32497']);
    if (res.rows.length === 0) {
      console.log('Product 32497 not found');
      return;
    }
    const p = res.rows[0];

    const images = {
      rosa: 'https://res.cloudinary.com/daom5jnck/image/upload/v1775731183/32497_2_awjnic.jpg',
      blanco: 'https://res.cloudinary.com/daom5jnck/image/upload/v1774615424/32497_BLANCO_frstrh.jpg',
      beig: 'https://res.cloudinary.com/daom5jnck/image/upload/v1774615425/32497_1_ARENA_xgvy23.jpg'
    };

    const sizes = {
      rosa: {
        '1 Mes ( 54 cm)': 1,
        '3 Meses (60 cm)': 1,
        '6 Meses (67 cm)': 1,
        '12 Meses (74 cm)': 1,
        '18 Meses (81 cm)': 1,
        '24 Meses (86 cm)': 1
      },
      blanco: {
        '1 Mes ( 54 cm)': 1,
        '6 Meses (67 cm)': 1,
        '24 Meses (86 cm)': 1
      },
      beig: {
        '3 Meses (60 cm)': 1,
        '18 Meses (81 cm)': 1
      }
    };

    // 1. Update 32497 to be Rosa
    await pool.query(
      'UPDATE products SET name = $1, color = $2, image_url = $3, local_images = $4, sizes_stock = $5 WHERE code = $6',
      ['PELELE ALBORAN', 'Rosa', images.rosa, JSON.stringify([images.rosa]), sizes.rosa, '32497']
    );
    console.log('Updated 32497 (Rosa)');

    // 2. Insert or Update 32497-BLANCO
    const codeBlanco = '32497-BLANCO';
    const checkBlanco = await pool.query('SELECT code FROM products WHERE code = $1', [codeBlanco]);
    if (checkBlanco.rows.length === 0) {
      await pool.query(`
        INSERT INTO products (code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url, local_images)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        codeBlanco, 'PELELE ALBORAN', p.description, 'Blanco', p.original_price, p.discounted_price, p.brand, p.category, sizes.blanco, images.blanco, JSON.stringify([images.blanco])
      ]);
      console.log('Inserted 32497-BLANCO');
    } else {
      await pool.query(
        'UPDATE products SET name = $1, color = $2, image_url = $3, local_images = $4, sizes_stock = $5 WHERE code = $6',
        ['PELELE ALBORAN', 'Blanco', images.blanco, JSON.stringify([images.blanco]), sizes.blanco, codeBlanco]
      );
      console.log('Updated 32497-BLANCO');
    }

    // 3. Insert or Update 32497-BEIG
    const codeBeig = '32497-BEIG';
    const checkBeig = await pool.query('SELECT code FROM products WHERE code = $1', [codeBeig]);
    if (checkBeig.rows.length === 0) {
      await pool.query(`
        INSERT INTO products (code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url, local_images)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        codeBeig, 'PELELE ALBORAN', p.description, 'Beig', p.original_price, p.discounted_price, p.brand, p.category, sizes.beig, images.beig, JSON.stringify([images.beig])
      ]);
      console.log('Inserted 32497-BEIG');
    } else {
      await pool.query(
        'UPDATE products SET name = $1, color = $2, image_url = $3, local_images = $4, sizes_stock = $5 WHERE code = $6',
        ['PELELE ALBORAN', 'Beig', images.beig, JSON.stringify([images.beig]), sizes.beig, codeBeig]
      );
      console.log('Updated 32497-BEIG');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

setupAlboranVariants();
