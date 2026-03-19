import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import pg from "pg";
import fs from "fs";

const { Pool } = pg;

// Lazy initialization para la conexión a la base de datos
let pool: pg.Pool | null = null;

function getDbPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("⚠️ DATABASE_URL no está configurada. La base de datos no funcionará.");
      return null;
    }
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Requerido por Neon
      }
    });
  }
  return pool;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // API ROUTES
  // ==========================================
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/seed", async (req, res) => {
    const db = getDbPool();
    if (!db) return res.status(503).json({ error: "DB not configured" });
    try {
      const fs = await import("fs");
      const schemaSql = fs.readFileSync("schema.sql", "utf8");
      await db.query(schemaSql);
      
      const sql = fs.readFileSync("catalog_seed.sql", "utf8");
      await db.query(sql);
      res.json({ success: true, message: "Esquema y catálogo importados correctamente" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Endpoint para obtener el catálogo de productos de forma eficiente
  app.get("/api/products", async (req, res) => {
    const db = getDbPool();
    
    // Si no hay base de datos configurada, usar el archivo JSON local como fallback
    if (!db) {
      try {
        const productsData = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf8');
        let products = JSON.parse(productsData);
        
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;
        const category = req.query.category as string;
        const brand = req.query.brand as string;

        if (category) {
          products = products.filter((p: any) => p.category === category);
        }
        if (brand) {
          products = products.filter((p: any) => p.brand.toLowerCase().includes(brand.toLowerCase()));
        }

        const total = products.length;
        const paginatedProducts = products.slice(offset, offset + limit);

        return res.json({
          data: paginatedProducts,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        });
      } catch (err) {
        console.error("Error reading fallback JSON:", err);
        return res.status(503).json({ error: "Base de datos no configurada y no se pudo cargar el catálogo local." });
      }
    }

    try {
      // Paginación para cargar eficientemente los 700 productos
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      const brand = req.query.brand as string;

      let query = 'SELECT * FROM products';
      const params: any[] = [];
      const conditions: string[] = [];

      if (category) {
        params.push(category);
        conditions.push(`category = $${params.length}`);
      }
      
      if (brand) {
        params.push(brand);
        conditions.push(`brand ILIKE $${params.length}`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      
      // Obtener el total para la paginación
      let countQuery = 'SELECT COUNT(*) FROM products';
      const countParams: any[] = [];
      if (conditions.length > 0) {
        countQuery += ' WHERE ' + conditions.join(' AND ');
        // Reutilizamos los mismos parámetros (sin limit/offset)
        countParams.push(...params.slice(0, params.length - 2));
      }
      
      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        data: result.rows,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error interno del servidor al obtener los productos" });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE (Frontend)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
