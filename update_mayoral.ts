import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateMayoral() {
  try {
    const res = await pool.query(`SELECT code, name, color, sizes_stock FROM products WHERE brand = 'Mayoral'`);
    for (const row of res.rows) {
      // 1. Revert discount
      // 2. Format name: UPPERCASE
      // 3. Include color in name if not already there
      let newName = row.name.toUpperCase();
      const colorUpper = row.color ? row.color.toUpperCase() : '';
      
      if (colorUpper && !newName.includes(colorUpper)) {
        newName = `${newName} - ${colorUpper}`;
      }

      // 4. Format sizes: Title Case like Calamaro (e.g. "18 Meses (86 cm)")
      const newSizes: Record<string, number> = {};
      for (const [size, stock] of Object.entries(row.sizes_stock)) {
        // "18 MESES (86 CM)" -> "18 Meses (86 cm)"
        // "2 AÑOS (92 CM)" -> "2 Años (92 cm)"
        let formattedSize = size.toLowerCase();
        formattedSize = formattedSize.replace(/\b(meses|mes|años|año)\b/g, (match) => {
          return match.charAt(0).toUpperCase() + match.slice(1);
        });
        // Capitalize the first letter if it's a word
        formattedSize = formattedSize.charAt(0).toUpperCase() + formattedSize.slice(1);
        newSizes[formattedSize] = stock as number;
      }

      await pool.query(
        `UPDATE products 
         SET 
           discounted_price = original_price,
           name = $1,
           sizes_stock = $2
         WHERE code = $3`,
        [newName, JSON.stringify(newSizes), row.code]
      );
    }
    console.log('Mayoral products updated successfully.');
  } catch (err) {
    console.error('Error updating Mayoral products:', err);
  } finally {
    await pool.end();
  }
}

updateMayoral();
