import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const productsData = [
  {
    code: "26505-B",
    category: "bano",
    name: "Culetin baño cuadros",
    description: "85% Poliéster",
    price: 10.00,
    color: "melocoton",
    sizes: ["12 MESES", "24 MESES", "3 AÑOS", "4 AÑOS"]
  },
  {
    code: "23069-B",
    category: "bano",
    name: "Conjunto baño vichy",
    description: "100% algodon",
    price: 19.90,
    color: "turquesa",
    sizes: ["12 MESES", "18 MESES", "24 MESES"]
  },
  {
    code: "23070",
    category: "bano",
    name: "Conjunto baño vichy",
    description: "100% algodón",
    price: 19.90,
    color: "turquesa",
    sizes: ["12 MESES", "18 MESES", "24 MESES"]
  },
  {
    code: "11349",
    category: "bebe-nino",
    name: "conjunto pantalon peces",
    description: "50% algodón",
    price: 23.50,
    color: "marino",
    sizes: ["12 MESES", "18 MESES", "24 MESES"]
  },
  {
    code: "26018-B",
    category: "bano",
    name: "short baño peces",
    description: "85% poliester",
    price: 8.95,
    color: "marino",
    sizes: ["12 MESES", "18 MESES", "24 MESES"]
  },
  {
    code: "26018-N",
    category: "bano",
    name: "short baño peces",
    description: "85% poliester",
    price: 9.95,
    color: "marino",
    sizes: ["3 AÑOS", "4 AÑOS"]
  }
];

async function importProducts() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    for (const prod of productsData) {
      // Handle sizes
      const sizesStock = {};
      for (const size of prod.sizes) {
        sizesStock[size.trim()] = 5; // Default stock 5
      }

      // Check if product exists
      const checkRes = await pool.query('SELECT code FROM products WHERE code = $1', [prod.code]);

      if (checkRes.rows.length > 0) {
        console.log(`Updating product ${prod.code}...`);
        await pool.query(
          `UPDATE products 
           SET name = $1, description = $2, original_price = $3, discounted_price = $3, category = $4, brand = $5, color = $6, sizes_stock = $7
           WHERE code = $8`,
          [prod.name.toUpperCase(), prod.description, prod.price, prod.category, 'Calamaro', prod.color.toUpperCase(), JSON.stringify(sizesStock), prod.code]
        );
      } else {
        console.log(`Inserting product ${prod.code}...`);
        await pool.query(
          `INSERT INTO products (code, name, description, original_price, discounted_price, category, brand, color, image_url, sizes_stock)
           VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8, $9)`,
          [prod.code, prod.name.toUpperCase(), prod.description, prod.price, prod.category, 'Calamaro', prod.color.toUpperCase(), '', JSON.stringify(sizesStock)]
        );
      }
    }
    console.log("Import completed successfully!");
  } catch (err) {
    console.error("Error importing products:", err);
  } finally {
    await pool.end();
  }
}

importProducts();
