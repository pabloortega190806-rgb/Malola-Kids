import express from "express";
import pg from "pg";
import fs from "fs";
import path from "path";
import { list } from "@vercel/blob";
import "dotenv/config";

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

async function findSimilarProductCodes(code: string): Promise<string[]> {
  const db = getDbPool();
  try {
    if (db) {
      const productResult = await db.query('SELECT name FROM products WHERE code = $1', [code]);
      if (productResult.rows.length > 0) {
        const productName = productResult.rows[0].name;
        const similarProductsResult = await db.query('SELECT code FROM products WHERE name = $1 AND code != $2', [productName, code]);
        return similarProductsResult.rows.map(r => r.code);
      }
    } else {
      const productsData = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf8');
      const products = JSON.parse(productsData);
      const product = products.find((p: any) => p.code === code);
      if (product) {
        return products.filter((p: any) => p.name === product.name && p.code !== code).map((p: any) => p.code);
      }
    }
  } catch (err) {
    console.error("Error finding similar products:", err);
  }
  return [];
}

async function findBlobsForCode(code: string): Promise<{ blobs: any[], matchedVariation: string }> {
  const codeStr = String(code).trim();
  const baseCode = codeStr.split(/[-_]/)[0];
  
  const variations = Array.from(new Set([
    codeStr,
    codeStr.replace(/-/g, '_'),
    codeStr.replace(/_/g, '-')
  ]));

  const allBlobs = await getAllBlobs();

  for (const variation of variations) {
    const matchingBlobs = allBlobs.filter(blob => {
      const ext = path.extname(blob.pathname).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      const nameWithoutExt = path.basename(blob.pathname, ext);
      return isImage && nameWithoutExt.startsWith(variation) && 
        (nameWithoutExt.substring(variation.length) === '' || /^[-_. ]/.test(nameWithoutExt.substring(variation.length)));
    });
    if (matchingBlobs.length > 0) {
      return { blobs: matchingBlobs, matchedVariation: variation };
    }
  }

  if (codeStr !== baseCode) {
    const matchingBlobs = allBlobs.filter(blob => {
      const ext = path.extname(blob.pathname).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      const nameWithoutExt = path.basename(blob.pathname, ext);
      return isImage && nameWithoutExt.startsWith(baseCode) && 
        (nameWithoutExt.substring(baseCode.length) === '' || /^[^0-9]/.test(nameWithoutExt.substring(baseCode.length)));
    });
    if (matchingBlobs.length > 0) {
      return { blobs: matchingBlobs, matchedVariation: baseCode };
    }
  }

  // Fallback to similar products by name
  const similarCodes = await findSimilarProductCodes(codeStr);
  for (const similarCode of similarCodes) {
    const similarBaseCode = similarCode.split(/[-_]/)[0];
    const similarVariations = Array.from(new Set([
      similarCode,
      similarCode.replace(/-/g, '_'),
      similarCode.replace(/_/g, '-')
    ]));

    for (const variation of similarVariations) {
      const matchingBlobs = allBlobs.filter(blob => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        const nameWithoutExt = path.basename(blob.pathname, ext);
        return isImage && nameWithoutExt.startsWith(variation) && 
          (nameWithoutExt.substring(variation.length) === '' || /^[-_. ]/.test(nameWithoutExt.substring(variation.length)));
      });
      if (matchingBlobs.length > 0) {
        return { blobs: matchingBlobs, matchedVariation: variation };
      }
    }
    
    if (similarCode !== similarBaseCode) {
      const matchingBlobs = allBlobs.filter(blob => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        const nameWithoutExt = path.basename(blob.pathname, ext);
        return isImage && nameWithoutExt.startsWith(similarBaseCode) && 
          (nameWithoutExt.substring(similarBaseCode.length) === '' || /^[^0-9]/.test(nameWithoutExt.substring(similarBaseCode.length)));
      });
      if (matchingBlobs.length > 0) {
        return { blobs: matchingBlobs, matchedVariation: similarBaseCode };
      }
    }
  }

  return { blobs: [], matchedVariation: codeStr };
}

async function getProductImages(code: string | number, localFiles: string[]): Promise<{ images: string[], mainImage?: string }> {
  const codeStr = String(code).trim();
  const baseCode = codeStr.split('-')[0]; // Extract base code, e.g., '21327' from '21327-B'
  
  // Use the new API endpoint to resolve the correct image URL
  const images = [
    `/api/get-image/${codeStr}`
  ];
  
  if (codeStr !== baseCode) {
    images.push(`/api/get-image/${baseCode}`);
  }
  
  return { images, mainImage: images[0] };
}

const app = express();
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

// Debug endpoint to check environment variables
app.get("/api/debug-env", (req, res) => {
  res.json({
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    blobTokenPrefix: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 15) + '...' : null,
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint to resolve and redirect to the correct Vercel Blob image
app.get("/api/get-image/:code", async (req, res) => {
  const { code } = req.params;
  const index = parseInt(req.query.index as string) || 0;
  
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs: matchingBlobs } = await findBlobsForCode(code);

      // Sort to ensure consistent order
      matchingBlobs.sort((a, b) => {
        const aName = path.basename(a.pathname, path.extname(a.pathname));
        const bName = path.basename(b.pathname, path.extname(b.pathname));
        return aName.localeCompare(bName);
      });

      if (matchingBlobs.length > index) {
        const blobUrl = matchingBlobs[index].url;
        // If it's a private blob, redirect to our proxy
        if (blobUrl.includes('.private.blob.vercel-storage.com')) {
          return res.redirect(`/api/proxy-image?url=${encodeURIComponent(blobUrl)}`);
        }
        // Otherwise redirect to the actual Vercel Blob URL
        return res.redirect(blobUrl);
      } else if (matchingBlobs.length > 0) {
        // Fallback to first image if index is out of bounds
        const blobUrl = matchingBlobs[0].url;
        if (blobUrl.includes('.private.blob.vercel-storage.com')) {
          return res.redirect(`/api/proxy-image?url=${encodeURIComponent(blobUrl)}`);
        }
        return res.redirect(blobUrl);
      }
    }
    
    // Fallback if not found or no token
    res.redirect(`https://i.postimg.cc/placeholder/${code}.jpg`);
  } catch (error) {
    console.error(`Error fetching image for ${code}:`, error);
    res.redirect(`https://i.postimg.cc/placeholder/${code}.jpg`);
  }
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
    
    let countQuery = 'SELECT COUNT(*) FROM products';
    const countParams: any[] = [];
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
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

app.get("/api/product-images/:code", async (req, res) => {
  const code = req.params.code;
  const codeStr = String(code).trim();
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs: matchingBlobs, matchedVariation } = await findBlobsForCode(code);

      if (matchingBlobs.length > 0) {
        const images = matchingBlobs.map((_, index) => `/api/get-image/${matchedVariation}?index=${index}`);
        return res.json({ images });
      }
    }
    
    // Fallback
    res.json({ images: [`/api/get-image/${codeStr}`] });
  } catch (error) {
    console.error(`Error fetching product images for ${code}:`, error);
    res.json({ images: [`/api/get-image/${codeStr}`] });
  }
});

app.post("/api/validate-cart", async (req, res) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Formato de carrito inválido" });
  }

  const db = getDbPool();
  let productsData: any[] = [];

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

// Exportar la app para Vercel Serverless Functions
export default app;
