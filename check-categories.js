import { Pool } from 'pg';
import 'dotenv/config';

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const res = await pool.query('SELECT code, category, sizes_stock FROM products');
  
  let spansMultiple = 0;
  for (const p of res.rows) {
    const sizes = Object.keys(p.sizes_stock || {});
    let has0to4 = false;
    let has3to9 = false;
    
    for (const s of sizes) {
      const upper = s.toUpperCase();
      if (upper.includes('MES') || upper.includes('1 AÑO') || upper.includes('2 AÑO') || upper.includes('3 AÑO') || upper.includes('4 AÑO')) {
        has0to4 = true;
      }
      if (upper.includes('3 AÑO') || upper.includes('4 AÑO') || upper.includes('5 AÑO') || upper.includes('6 AÑO') || upper.includes('7 AÑO') || upper.includes('8 AÑO') || upper.includes('9 AÑO') || upper.includes('10 AÑO') || upper.includes('12 AÑO')) {
        has3to9 = true;
      }
    }
    
    if (has0to4 && has3to9) {
      spansMultiple++;
      console.log(`Product ${p.code} spans multiple: ${sizes.join(', ')} (Current: ${p.category})`);
    }
  }
  
  console.log(`Total spanning multiple: ${spansMultiple}`);
  await pool.end();
}

run();
