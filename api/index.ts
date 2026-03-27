import express from "express";
import pg from "pg";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import "dotenv/config";

const { Pool } = pg;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck",
  api_key: process.env.CLOUDINARY_API_KEY || "159654824825549",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mqrpVaFqzeYW9HnprvElLH39dNg",
});

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

let imageCache: any[] = [];
let imageCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getAllCloudinaryImages() {
  if (Date.now() - imageCacheTime < CACHE_TTL && imageCache.length > 0) {
    return imageCache;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck";
  if (!cloudName) return [];
  
  try {
    let allResources: any[] = [];
    let nextCursor = null;
    
    do {
      const result: any = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor
      });
      
      allResources.push(...result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);
    
    // Mapear al formato que usábamos con Vercel Blob para minimizar cambios
    imageCache = allResources.map(res => {
      // Extraer solo el nombre del archivo sin las carpetas
      const filename = res.public_id.split('/').pop();
      // Eliminar el sufijo aleatorio de 6 caracteres que añade Cloudinary (ej: _cwojeb)
      const cleanFilename = filename.replace(/_[a-z0-9]{6}$/i, '');
      return {
        pathname: cleanFilename + '.' + (res.format || 'jpg'),
        url: res.secure_url
      };
    });
    
    imageCacheTime = Date.now();
    console.log(`[Cloudinary Cache] Loaded ${allResources.length} images.`);
    return imageCache;
  } catch (error) {
    console.error("[Cloudinary Cache] Error fetching images:", error);
    return imageCache;
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
  
  // Clean the code if it already has the prefix
  let cleanCodeStr = codeStr;
  if (cleanCodeStr.startsWith('26-') || cleanCodeStr.startsWith('26_')) {
    cleanCodeStr = cleanCodeStr.substring(3);
  }

  const baseCode = cleanCodeStr.split(/[-_]/)[0];
  
  const variations = Array.from(new Set([
    `26-${cleanCodeStr}`,
    `26_${cleanCodeStr}`,
    cleanCodeStr,
    cleanCodeStr.replace(/-/g, '_'),
    cleanCodeStr.replace(/_/g, '-')
  ]));

  // Mayoral specific variations
  // e.g., 1643.76 -> 26-01643-076
  if (cleanCodeStr.includes('.')) {
    const parts = cleanCodeStr.split('.');
    if (parts.length === 2) {
      const part1 = parts[0].padStart(5, '0');
      const part2 = parts[1].padStart(3, '0');
      variations.push(`26-${part1}-${part2}`);
      variations.push(`26_${part1}_${part2}`);
    } else if (parts.length === 3) {
      const part1 = (parts[0] + parts[1]).padStart(5, '0');
      const part2 = parts[2].padStart(3, '0');
      variations.push(`26-${part1}-${part2}`);
      variations.push(`26_${part1}_${part2}`);
    }
  } else if (cleanCodeStr.includes('-')) {
    const parts = cleanCodeStr.split('-');
    if (parts.length === 2) {
      const part1 = parts[0].padStart(5, '0');
      const part2 = parts[1].padStart(3, '0');
      variations.push(`26-${part1}-${part2}`);
      variations.push(`26_${part1}_${part2}`);
    }
  }

  const allBlobs = await getAllCloudinaryImages();

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

  if (cleanCodeStr !== baseCode) {
    const baseVariations = Array.from(new Set([
      `26-${baseCode}`,
      `26_${baseCode}`,
      baseCode
    ]));

    for (const variation of baseVariations) {
      const matchingBlobs = allBlobs.filter(blob => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        const nameWithoutExt = path.basename(blob.pathname, ext);
        return isImage && nameWithoutExt.startsWith(variation) && 
          (nameWithoutExt.substring(variation.length) === '' || /^[^0-9]/.test(nameWithoutExt.substring(variation.length)));
      });
      if (matchingBlobs.length > 0) {
        return { blobs: matchingBlobs, matchedVariation: variation };
      }
    }
  }

  // Fallback to similar products by name
  const similarCodes = await findSimilarProductCodes(cleanCodeStr);
  for (const similarCode of similarCodes) {
    let cleanSimilarCode = similarCode;
    if (cleanSimilarCode.startsWith('26-') || cleanSimilarCode.startsWith('26_')) {
      cleanSimilarCode = cleanSimilarCode.substring(3);
    }
    const similarBaseCode = cleanSimilarCode.split(/[-_]/)[0];
    
    const similarVariations = Array.from(new Set([
      `26-${cleanSimilarCode}`,
      `26_${cleanSimilarCode}`,
      cleanSimilarCode,
      cleanSimilarCode.replace(/-/g, '_'),
      cleanSimilarCode.replace(/_/g, '-')
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
    
    if (cleanSimilarCode !== similarBaseCode) {
      const similarBaseVariations = Array.from(new Set([
        `26-${similarBaseCode}`,
        `26_${similarBaseCode}`,
        similarBaseCode
      ]));
      
      for (const variation of similarBaseVariations) {
        const matchingBlobs = allBlobs.filter(blob => {
          const ext = path.extname(blob.pathname).toLowerCase();
          const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
          const nameWithoutExt = path.basename(blob.pathname, ext);
          return isImage && nameWithoutExt.startsWith(variation) && 
            (nameWithoutExt.substring(variation.length) === '' || /^[^0-9]/.test(nameWithoutExt.substring(variation.length)));
        });
        if (matchingBlobs.length > 0) {
          return { blobs: matchingBlobs, matchedVariation: variation };
        }
      }
    }
  }

  return { blobs: [], matchedVariation: codeStr };
}

async function getProductImages(code: string | number, localFiles: string[]): Promise<{ images: string[], mainImage?: string }> {
  const codeStr = String(code).trim();
  
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck";
    if (cloudName) {
      const { blobs: matchingBlobs, matchedVariation } = await findBlobsForCode(codeStr);

      if (matchingBlobs.length > 0) {
        // Sort to ensure consistent order
        matchingBlobs.sort((a, b) => {
          const aName = path.basename(a.pathname, path.extname(a.pathname));
          const bName = path.basename(b.pathname, path.extname(b.pathname));
          return aName.localeCompare(bName);
        });

        const images = matchingBlobs.map((_, index) => `/api/get-image/${matchedVariation}?index=${index}`);
        return { images, mainImage: images[0] };
      }
    }
  } catch (error) {
    console.error(`Error fetching product images for ${code}:`, error);
  }

  // Clean the code if it already has the prefix
  let cleanCodeStr = codeStr;
  if (cleanCodeStr.startsWith('26-') || cleanCodeStr.startsWith('26_')) {
    cleanCodeStr = cleanCodeStr.substring(3);
  }

  const baseCode = cleanCodeStr.split('-')[0]; // Extract base code, e.g., '21327' from '21327-B'
  
  // Use the new API endpoint to resolve the correct image URL
  const images = [
    `/api/get-image/${cleanCodeStr}`
  ];
  
  if (cleanCodeStr !== baseCode) {
    images.push(`/api/get-image/${baseCode}`);
  }
  
  return { images, mainImage: images[0] };
}

const app = express();
app.use(express.json());

// Analytics tracking endpoint
app.post("/api/track-view", (req, res) => {
  const db = getDbPool();
  if (db) {
    const { path } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || '';
    
    if (path) {
      db.query(
        'INSERT INTO page_views (path, user_agent, referrer) VALUES ($1, $2, $3)',
        [path, userAgent, referrer]
      ).catch(err => console.error("Error tracking page view:", err));
    }
  }
  res.json({ success: true });
});

// ==========================================
// ADMIN ROUTES
// ==========================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MALOLAKIDS2026';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'malola-admin-secret-token';

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  
  const providedPassword = (password || "").trim().toUpperCase();
  const expectedPassword = "MALOLAKIDS2026";
  
  // Also accept whatever is in the environment variable just in case
  const envPassword = (process.env.ADMIN_PASSWORD || "").trim().toUpperCase();
  
  if (providedPassword === expectedPassword || (envPassword && providedPassword === envPassword)) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, error: "Contraseña incorrecta" });
  }
});

// Middleware to check admin token
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ success: false, error: "No autorizado" });
  }
};

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/admin/upload-image", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No se proporcionó ninguna imagen" });
    }

    // Convertir el buffer a base64 para Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    let publicId = undefined;
    if (req.body.code) {
      let codeStr = String(req.body.code).trim();
      if (codeStr.startsWith('26-') || codeStr.startsWith('26_')) {
        codeStr = codeStr.substring(3);
      }
      publicId = `26-${codeStr}`;
    }

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "malola_catalog",
      resource_type: "image",
      fetch_format: "auto",
      quality: "auto",
      // Si se proporciona un código de producto, usarlo como public_id con el prefijo 26-
      public_id: publicId,
      overwrite: true
    });

    // Invalidate cache
    imageCacheTime = 0;

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error: any) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ success: false, error: error.message || "Error al subir la imagen" });
  }
});

app.put("/api/products/:code", requireAdmin, async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(503).json({ error: "DB not configured" });
  
  const { code } = req.params;
  const { name, description, color, original_price, discounted_price, brand, category, sizes_stock } = req.body;
  
  try {
    const query = `
      UPDATE products 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        color = COALESCE($3, color),
        original_price = COALESCE($4, original_price),
        discounted_price = COALESCE($5, discounted_price),
        brand = COALESCE($6, brand),
        category = COALESCE($7, category),
        sizes_stock = COALESCE($8, sizes_stock),
        updated_at = CURRENT_TIMESTAMP
      WHERE code = $9
      RETURNING *
    `;
    
    const values = [
      name, 
      description, 
      color, 
      original_price, 
      discounted_price, 
      brand, 
      category, 
      sizes_stock ? JSON.stringify(sizes_stock) : null,
      code
    ];
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    res.json({ success: true, product: result.rows[0] });
  } catch (err: any) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(503).json({ error: "DB not configured" });

  try {
    // Get views by day for the last 7 days
    const viewsByDayResult = await db.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
        COUNT(*) as views
      FROM page_views
      WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `);

    // Get top pages
    const topPagesResult = await db.query(`
      SELECT path, COUNT(*) as views
      FROM page_views
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `);

    // Get total views
    const totalViewsResult = await db.query(`
      SELECT COUNT(*) as total FROM page_views
    `);

    res.json({
      success: true,
      data: {
        viewsByDay: viewsByDayResult.rows.map(r => ({ date: r.date, views: parseInt(r.views) })),
        topPages: topPagesResult.rows.map(r => ({ path: r.path, views: parseInt(r.views) })),
        totalViews: parseInt(totalViewsResult.rows[0].total)
      }
    });
  } catch (err: any) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// API ROUTES
// ==========================================

// Debug endpoint to check environment variables
app.get("/api/debug-env", (req, res) => {
  res.json({
    hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    adminPassword: process.env.ADMIN_PASSWORD || 'MALOLAKIDS2026'
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/debug/images", async (req, res) => {
  try {
    const blobs = await getAllCloudinaryImages();
    res.json({ 
      count: blobs.length, 
      sample: blobs,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck"
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint to resolve and redirect to the correct Cloudinary image
app.get("/api/get-image/:code", async (req, res) => {
  const { code } = req.params;
  const index = parseInt(req.query.index as string) || 0;
  
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck";
    if (cloudName) {
      const { blobs: matchingBlobs } = await findBlobsForCode(code);

      // Sort to ensure consistent order
      matchingBlobs.sort((a, b) => {
        const aName = path.basename(a.pathname, path.extname(a.pathname));
        const bName = path.basename(b.pathname, path.extname(b.pathname));
        return aName.localeCompare(bName);
      });

      if (matchingBlobs.length > index) {
        return res.redirect(matchingBlobs[index].url);
      } else if (matchingBlobs.length > 0) {
        // Fallback to first image if index is out of bounds
        return res.redirect(matchingBlobs[0].url);
      }
    }
    
    // Fallback if not found or no token
    res.redirect(`https://i.postimg.cc/placeholder/${code}.jpg`);
  } catch (error) {
    console.error(`Error fetching image for ${code}:`, error);
    res.redirect(`https://i.postimg.cc/placeholder/${code}.jpg`);
  }
});

// Endpoint removed as Cloudinary URLs are public

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

app.get("/api/categories", async (req, res) => {
  const db = getDbPool();
  if (!db) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const productsData = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf8');
      const products = JSON.parse(productsData);
      const categories = Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean);
      return res.json(categories);
    } catch (err) {
      console.error("Error reading fallback products.json for categories:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  try {
    const result = await db.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener categorías" });
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
      const gender = req.query.gender as string;
      const age = req.query.age as string;
      const search = req.query.search as string;

      if (category) {
        products = products.filter((p: any) => p.category === category);
      }
      if (brand) {
        products = products.filter((p: any) => p.brand.toLowerCase().includes(brand.toLowerCase()));
      }
      if (gender) {
        products = products.filter((p: any) => p.category.toLowerCase().includes(gender.toLowerCase()));
      }
      if (age) {
        products = products.filter((p: any) => p.category.toLowerCase().includes(age.toLowerCase()));
      }
      if (search) {
        const keywords = search.toLowerCase().trim().split(/\s+/).filter(k => k.length > 0);
        products = products.filter((p: any) => {
          const searchableText = `${p.code} ${p.name} ${p.description || ''} ${p.brand || ''} ${p.category || ''} ${p.color || ''} ${JSON.stringify(p.sizes_stock || {})}`.toLowerCase();
          return keywords.every(kw => searchableText.includes(kw));
        });
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
    const gender = req.query.gender as string;
    const age = req.query.age as string;
    const search = req.query.search as string;

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

    if (gender) {
      params.push(`%${gender}%`);
      conditions.push(`category ILIKE $${params.length}`);
    }

    if (age) {
      params.push(`%${age}%`);
      conditions.push(`category ILIKE $${params.length}`);
    }

    if (search) {
      const keywords = search.trim().split(/\s+/).filter(k => k.length > 0);
      keywords.forEach(kw => {
        params.push(`%${kw}%`);
        conditions.push(`(
          code ILIKE $${params.length} OR 
          name ILIKE $${params.length} OR 
          description ILIKE $${params.length} OR 
          brand ILIKE $${params.length} OR 
          category ILIKE $${params.length} OR 
          color ILIKE $${params.length} OR
          sizes_stock::text ILIKE $${params.length}
        )`);
      });
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
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck";
    if (cloudName) {
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
