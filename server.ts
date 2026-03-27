import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import pg from "pg";
import "dotenv/config";
import apiApp from "./api/index.js";

const { Pool } = pg;
let pool: pg.Pool | null = null;

function getDbPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return null;
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function initDb() {
  const db = getDbPool();
  if (!db) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        path VARCHAR(255) NOT NULL,
        user_agent TEXT,
        referrer TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
    `);
    console.log("Database tables initialized successfully.");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  await initDb();

  // Mount API routes from api/index.ts
  app.use(apiApp);

  // Vite middleware
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
