import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateCategories() {
  try {
    const res = await pool.query('SELECT code, name, category, brand FROM products');
    
    for (const row of res.rows) {
      let newCategory = row.category;
      const nameUpper = row.name.toUpperCase();
      const catUpper = row.category.toUpperCase();

      if (catUpper.includes('BAÑO')) {
        newCategory = 'Baño';
      } else if (catUpper.includes('COMPLEMENTOS')) {
        newCategory = 'Complementos';
      } else if (catUpper.includes('NIÑA 3 A 9 AÑOS')) {
        newCategory = 'Niña (3-9 años)';
      } else if (catUpper.includes('NIÑO 3 A 9 AÑOS')) {
        newCategory = 'Niño (3-9 años)';
      } else if (catUpper.includes('BEBE NIÑA') || catUpper.includes('MINI NIÑA')) {
        newCategory = 'Bebé Niña (0-4 años)';
      } else if (catUpper.includes('BEBE NIÑO') || catUpper.includes('MINI NIÑO') || catUpper === 'BEBE NIÑO 0-4 AÑOS') {
        newCategory = 'Bebé Niño (0-4 años)';
      } else if (row.brand === 'Calamaro') {
        // Calamaro logic
        if (nameUpper.includes('VESTIDO') || nameUpper.includes('JESUSITO') || nameUpper.includes('LAZO')) {
          newCategory = 'Bebé Niña (0-4 años)';
        } else {
          newCategory = 'Bebé Niño (0-4 años)';
        }
      }

      if (newCategory !== row.category) {
        console.log(row.category, '->', newCategory, '|', row.name);
        await pool.query('UPDATE products SET category = $1 WHERE code = $2', [newCategory, row.code]);
      }
    }
    console.log('Categories updated successfully.');
  } catch (err) {
    console.error('Error updating categories:', err);
  } finally {
    await pool.end();
  }
}

updateCategories();
