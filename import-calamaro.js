import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const productsData = [
  {
    code: "166177",
    category: "bano",
    name: "CONJUNTO BAÑO CAMISETA",
    description: "85% Poliéster 15% Elastano",
    price: 18.99,
    sizes: ["18 MESES (86 CM)", "2 AÑOS (92 CM)", "3 AÑOS (98 CM)", "4 AÑOS (104 CM)"]
  },
  {
    code: "11275",
    category: "bebe-nina",
    name: "CONJUNTO POLAINA GOA",
    description: "100% Algodón",
    price: 20.00,
    sizes: ["00 MESES (48 CM)", "0 MESES (50 CM)", "1 MES (54 CM)", "3 MESES (60CM)"]
  },
  {
    code: "11291",
    category: "bebe-nina",
    name: "CONJUNTO POLOLO SIKAR",
    description: "100% Algodón",
    price: 24.00,
    sizes: ["6 MESES (67 CM)", "12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)", "36 MESES (95CM)"]
  },
  {
    code: "11292",
    category: "bebe-nina",
    name: "CONJUNTO POLOLO SIKAR",
    description: "100% Algodón",
    price: 24.00,
    sizes: ["6 MESES (67 CM)", "12 MESES (74 CM)", "18 MESES (81CM)", "24 MESES (86CM)", "36 MESES (95CM)"]
  },
  {
    code: "11295",
    category: "bebe-nino",
    name: "CONJUNTO PETO GAYA",
    description: "100% Algodón",
    price: 28.90,
    sizes: ["12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)", "36 MESES (95CM)"]
  },
  {
    code: "11347-B",
    category: "bebe-nino",
    name: "CONJUNTO PANTALON CUADROS",
    description: "100% Algodón",
    price: 23.50,
    sizes: ["12 MESES (74 CM)", "18 MESES (81CM)", "24 MESES (86CM)"]
  },
  {
    code: "11347-N",
    category: "bebe-nino",
    name: "CONJUNTO PANTALON CUADROS",
    description: "100% Algodón",
    price: 26.90,
    sizes: ["3 AÑOS (98 CM)"]
  },
  {
    code: "22113",
    category: "bebe-nina",
    name: "JESUSITO BUNDI",
    description: "100% Algodón",
    price: 17.90,
    sizes: ["6 MESES (67 CM)", "12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)", "36 MESES (95CM)"]
  },
  {
    code: "23068-B",
    category: "bano",
    name: "CONJUNTO BAÑO CACHEMIR",
    description: "100% Algodón",
    price: 19.90,
    sizes: ["12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)"]
  },
  {
    code: "26504-B",
    category: "bano",
    name: "CULETIN BAÑO CUADROS",
    description: "100% Algodón",
    price: 10.90,
    sizes: ["12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)"]
  },
  {
    code: "26504-N",
    category: "bano",
    name: "CULETIN BAÑO CUADROS",
    description: "100% Algodón",
    price: 10.90,
    sizes: ["4 AÑOS"]
  },
  {
    code: "32497",
    category: "bebe-nino",
    name: "PELELE ALBORAN",
    description: "100% Algodón",
    price: 21.50,
    sizes: ["1 MES (54 CM)", "3 MESES (60CM)", "6 MESES (67 CM)", "12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)"]
  },
  {
    code: "32549",
    category: "bebe-nino",
    name: "PELELE BUNDI",
    description: "100% Algodón",
    price: 21.50,
    sizes: ["1 MES (54 CM)", "3 MESES (60CM)", "6 MESES (67 CM)", "12 MESES (74 CM)", "18 MESES (81 CM)", "24 MESES (86CM)"]
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
           SET name = $1, description = $2, original_price = $3, discounted_price = $3, category = $4, brand = $5, sizes_stock = $6
           WHERE code = $7`,
          [prod.name, prod.description, prod.price, prod.category, 'calamaro', JSON.stringify(sizesStock), prod.code]
        );
      } else {
        console.log(`Inserting product ${prod.code}...`);
        await pool.query(
          `INSERT INTO products (code, name, description, original_price, discounted_price, category, brand, image_url, sizes_stock)
           VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8)`,
          [prod.code, prod.name, prod.description, prod.price, prod.category, 'calamaro', '', JSON.stringify(sizesStock)]
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
