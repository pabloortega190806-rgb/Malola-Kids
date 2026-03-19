import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import pg from "pg";
import fs from "fs";
import { list } from "@vercel/blob";

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

let blobCache: any[] = [];
let blobCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getAllBlobs() {
  if (Date.now() - blobCacheTime < CACHE_TTL && blobCache.length > 0) {
    return blobCache;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  
  try {
    let cursor;
    let allBlobs: any[] = [];
    do {
      const result = await list({
        token: process.env.BLOB_READ_WRITE_TOKEN,
        cursor,
        limit: 1000,
      });
      allBlobs.push(...result.blobs);
      cursor = result.cursor;
    } while (cursor);
    
    blobCache = allBlobs;
    blobCacheTime = Date.now();
    console.log(`[Blob Cache] Loaded ${allBlobs.length} blobs from Vercel.`);
    return allBlobs;
  } catch (error) {
    console.error("[Blob Cache] Error fetching blobs:", error);
    return blobCache;
  }
}

async function getProductImages(code: string | number, localFiles: string[]): Promise<{ images: string[], mainImage?: string }> {
  const codeStr = String(code).trim();
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobs = await getAllBlobs();
      const matchingFiles = blobs.filter(blob => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        const nameWithoutExt = path.basename(blob.pathname, ext);
        const remainder = nameWithoutExt.substring(codeStr.length);
        return isImage && nameWithoutExt.startsWith(codeStr) && (remainder === '' || /^[-_.]/.test(remainder));
      });

      matchingFiles.sort((a, b) => {
        const aName = path.basename(a.pathname, path.extname(a.pathname));
        const bName = path.basename(b.pathname, path.extname(b.pathname));
        return aName.localeCompare(bName);
      });

      if (matchingFiles.length > 0) {
        const images = matchingFiles.map(file => `/api/proxy-image?url=${encodeURIComponent(file.url)}`);
        return { images, mainImage: images[0] };
      }
    }
    
    // Fallback to local files
    const matchingFiles = localFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      const nameWithoutExt = path.basename(file, ext);
      const remainder = nameWithoutExt.substring(codeStr.length);
      return isImage && nameWithoutExt.startsWith(codeStr) && (remainder === '' || /^[-_.]/.test(remainder));
    });

    matchingFiles.sort((a, b) => {
      const aName = path.basename(a, path.extname(a));
      const bName = path.basename(b, path.extname(b));
      return aName.localeCompare(bName);
    });

    if (matchingFiles.length > 0) {
      const images = matchingFiles.map(file => `/products/${file}`);
      return { images, mainImage: images[0] };
    }
  } catch (e) {
    console.error(`Error fetching images for ${codeStr}:`, e);
  }
  
  return { images: [] };
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

  // Endpoint para hacer proxy de imágenes privadas de Vercel Blob
  app.get("/api/proxy-image", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) return res.status(400).json({ error: "Falta la URL de la imagen" });
    
    try {
      const response = await fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).send(`Error fetching image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch (error) {
      console.error("Proxy image error:", error);
      res.status(500).send("Internal Server Error");
    }
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
    const publicProductsDir = path.join(process.cwd(), 'public', 'products');
    let localFiles: string[] = [];
    
    if (fs.existsSync(publicProductsDir)) {
      localFiles = fs.readdirSync(publicProductsDir);
    }

    const attachBlobImages = async (products: any[]) => {
      return Promise.all(products.map(async (product) => {
        const { images, mainImage } = await getProductImages(product.code, localFiles);
        if (images.length > 0) {
          product.local_images = images;
          product.image_url = mainImage;
        } else if (product.gallery_urls && Array.isArray(product.gallery_urls) && product.gallery_urls.length > 0) {
          product.local_images = product.gallery_urls;
        } else {
          product.local_images = [];
        }
        return product;
      }));
    };
    
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
        const productsWithImages = await attachBlobImages(paginatedProducts);

        return res.json({
          data: productsWithImages,
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
      const productsWithImages = await attachBlobImages(result.rows);

      res.json({
        data: productsWithImages,
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

  // Endpoint para obtener un producto específico por código
  app.get("/api/products/:code", async (req, res) => {
    const code = req.params.code;
    const db = getDbPool();
    const publicProductsDir = path.join(process.cwd(), 'public', 'products');
    let localFiles: string[] = [];
    
    if (fs.existsSync(publicProductsDir)) {
      localFiles = fs.readdirSync(publicProductsDir);
    }

    const attachBlobImages = async (product: any) => {
      const { images, mainImage } = await getProductImages(product.code, localFiles);
      if (images.length > 0) {
        product.local_images = images;
        product.image_url = mainImage;
      } else if (product.gallery_urls && Array.isArray(product.gallery_urls) && product.gallery_urls.length > 0) {
        product.local_images = product.gallery_urls;
      } else {
        product.local_images = [];
      }
      return product;
    };

    if (!db) {
      try {
        const productsData = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf8');
        const products = JSON.parse(productsData);
        const product = products.find((p: any) => p.code === code);
        
        if (!product) {
          return res.status(404).json({ error: "Producto no encontrado" });
        }
        
        const productWithImages = await attachBlobImages(product);
        return res.json(productWithImages);
      } catch (err) {
        return res.status(503).json({ error: "Base de datos no configurada y no se pudo cargar el catálogo local." });
      }
    }

    try {
      const result = await db.query('SELECT * FROM products WHERE code = $1', [code]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      
      const productWithImages = await attachBlobImages(result.rows[0]);
      res.json(productWithImages);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Error interno del servidor al obtener el producto" });
    }
  });

  // Endpoint para obtener imágenes de un producto por código
  app.get("/api/product-images/:code", async (req, res) => {
    const code = req.params.code;
    const publicProductsDir = path.join(process.cwd(), 'public', 'products');
    let localFiles: string[] = [];
    
    if (fs.existsSync(publicProductsDir)) {
      localFiles = fs.readdirSync(publicProductsDir);
    }
    
    const { images } = await getProductImages(code, localFiles);
    res.json({ images });
  });

  // Endpoint para validar el stock del carrito
  app.post("/api/validate-cart", async (req, res) => {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Formato de carrito inválido" });
    }

    const db = getDbPool();
    let productsData: any[] = [];

    // Cargar productos (de DB o JSON)
    if (!db) {
      try {
        const data = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf8');
        productsData = JSON.parse(data);
      } catch (err) {
        return res.status(503).json({ error: "No se pudo cargar el catálogo para validar." });
      }
    } else {
      try {
        const codes = items.map(item => item.code);
        if (codes.length === 0) return res.json({ valid: true, issues: [] });
        
        const placeholders = codes.map((_, i) => `$${i + 1}`).join(',');
        const result = await db.query(`SELECT * FROM products WHERE code IN (${placeholders})`, codes);
        productsData = result.rows;
      } catch (err) {
        return res.status(500).json({ error: "Error al consultar la base de datos." });
      }
    }

    const issues: { code: string; name: string; size: string; requested: number; available: number; issue: string }[] = [];

    for (const item of items) {
      const product = productsData.find(p => p.code === item.code);
      if (!product) {
        issues.push({
          code: item.code,
          name: "Producto desconocido",
          size: item.size,
          requested: item.quantity,
          available: 0,
          issue: "not_found"
        });
        continue;
      }

      const availableStock = Number(product.sizes_stock[item.size] || 0);
      if (availableStock < item.quantity) {
        issues.push({
          code: item.code,
          name: product.name,
          size: item.size,
          requested: item.quantity,
          available: availableStock,
          issue: availableStock === 0 ? "out_of_stock" : "insufficient_stock"
        });
      }
    }

    if (issues.length > 0) {
      return res.status(400).json({ valid: false, issues });
    }

    return res.json({ valid: true });
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
