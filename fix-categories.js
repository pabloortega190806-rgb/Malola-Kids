import { Pool } from 'pg';
import 'dotenv/config';

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const res = await pool.query('SELECT code, category, sizes_stock FROM products');
  
  let updatedCount = 0;

  for (const p of res.rows) {
    const sizes = Object.keys(p.sizes_stock || {});
    let has0to4 = false;
    let has3to9 = false;
    let has0to12m = false;
    
    for (const s of sizes) {
      const upper = s.toUpperCase();
      if (upper.includes('MES') || upper.includes('1 AÑO') || upper.includes('2 AÑO') || upper.includes('3 AÑO') || upper.includes('4 AÑO')) {
        has0to4 = true;
      }
      if (upper.includes('3 AÑO') || upper.includes('4 AÑO') || upper.includes('5 AÑO') || upper.includes('6 AÑO') || upper.includes('7 AÑO') || upper.includes('8 AÑO') || upper.includes('9 AÑO') || upper.includes('10 AÑO') || upper.includes('12 AÑO') || upper.includes('14 AÑO') || upper.includes('16 AÑO')) {
        has3to9 = true;
      }
      if (upper.includes('MES') && !upper.includes('18') && !upper.includes('24') && !upper.includes('36')) {
        // 0, 1, 3, 6, 9, 12 meses
        has0to12m = true;
      }
    }

    // Determine gender from current category
    let isNina = p.category?.toLowerCase().includes('niña') || p.category?.toLowerCase().includes('nina');
    let isNino = p.category?.toLowerCase().includes('niño') || p.category?.toLowerCase().includes('nino');
    let isBano = p.category?.toLowerCase().includes('baño') || p.category?.toLowerCase().includes('bano');
    let isComplementos = p.category?.toLowerCase().includes('complementos');
    
    // Explicit fix for 1665.31
    if (p.code === '1665.31') {
      isNina = false;
      isNino = true;
    }

    let newCategories = new Set();

    if (isBano) {
      newCategories.add('Baño');
    } else if (isComplementos) {
      newCategories.add('Complementos');
    } else {
      // If it's not Baño or Complementos, assign based on age and gender
      if (isNina) {
        if (has0to4) newCategories.add('Bebé Niña (0-4 años)');
        if (has3to9) newCategories.add('Niña (3-9 años)');
      } else if (isNino) {
        if (has0to4) newCategories.add('Bebé Niño (0-4 años)');
        if (has3to9) newCategories.add('Niño (3-9 años)');
      } else {
        // If gender is unknown (e.g. BEBE 0-12 MESES)
        if (p.category === 'BEBE 0-12 MESES') {
          newCategories.add('BEBE 0-12 MESES');
        } else {
          // Keep original if we can't determine
          if (p.category) newCategories.add(p.category);
        }
      }
    }

    // If no sizes matched our age groups but it has a gender, keep the original category or default
    if (newCategories.size === 0 && p.category) {
      newCategories.add(p.category);
    }

    const newCategoryStr = Array.from(newCategories).join(', ');

    if (newCategoryStr !== p.category) {
      await pool.query('UPDATE products SET category = $1 WHERE code = $2', [newCategoryStr, p.code]);
      updatedCount++;
      console.log(`Updated ${p.code}: ${p.category} -> ${newCategoryStr}`);
    }
  }
  
  console.log(`Total updated: ${updatedCount}`);
  await pool.end();
}

run();
