import express from "express";
import pg from "pg";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Stripe from "stripe";
import "dotenv/config";

const { Pool } = pg;

// Lazy initialization for Stripe
let stripeInstance: Stripe | null = null;

function getStripe() {
  if (!stripeInstance) {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      throw new Error("Falta la configuración de Stripe (STRIPE_SECRET_KEY). Si estás en Vercel, añádela en 'Project Settings > Environment Variables'.");
    }
    stripeInstance = new Stripe(STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

// Lazy initialization for Cloudinary
let cloudinaryConfigured = false;

function configureCloudinary() {
  if (!cloudinaryConfigured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("⚠️ Cloudinary credentials are not fully configured in environment variables.");
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    cloudinaryConfigured = true;
  }
}

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
  configureCloudinary();
  if (Date.now() - imageCacheTime < CACHE_TTL && imageCache.length > 0) {
    return imageCache;
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
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

  const baseCode = cleanCodeStr.split(/[-_.]/)[0];
  const alphanumericOnly = cleanCodeStr.replace(/[^a-zA-Z0-9]/g, '');
  
  const variations = Array.from(new Set([
    `26-${cleanCodeStr}`,
    `26_${cleanCodeStr}`,
    cleanCodeStr,
    cleanCodeStr.replace(/[-.]/g, '_'),
    cleanCodeStr.replace(/[_.]/g, '-'),
    alphanumericOnly,
    `26-${alphanumericOnly}`,
    `26_${alphanumericOnly}`
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
      variations.push(`26-${parts[0]}-${parts[1]}`);
      variations.push(`${parts[0]}-${parts[1]}`);
      variations.push(`${parts[0]}_${parts[1]}`);
      variations.push(parts[0] + parts[1]);
    } else if (parts.length === 3) {
      const part1 = (parts[0] + parts[1]).padStart(5, '0');
      const part2 = parts[2].padStart(3, '0');
      variations.push(`26-${part1}-${part2}`);
      variations.push(`26_${part1}_${part2}`);
      variations.push(`26-${parts[0]}${parts[1]}-${parts[2]}`);
      variations.push(`${parts[0]}${parts[1]}-${parts[2]}`);
      variations.push(`${parts[0]}${parts[1]}_${parts[2]}`);
      variations.push(parts[0] + parts[1] + parts[2]);
    }
  } else if (cleanCodeStr.includes('-')) {
    const parts = cleanCodeStr.split('-');
    if (parts.length === 2) {
      const part1 = parts[0].padStart(5, '0');
      const part2 = parts[1].padStart(3, '0');
      variations.push(`26-${part1}-${part2}`);
      variations.push(`26_${part1}_${part2}`);
      variations.push(parts[0] + parts[1]);
    }
  }

  const allBlobs = await getAllCloudinaryImages();

  for (const variation of variations) {
    const matchingBlobs = allBlobs.filter(blob => {
      const ext = path.extname(blob.pathname).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      const nameWithoutExt = path.basename(blob.pathname, ext);
      
      // Exact match or starts with variation + separator/number
      if (!isImage) return false;
      if (nameWithoutExt === variation) return true;
      
      // Flexible matching: if the image name contains the variation
      // e.g. "IMG_19093_27_front" contains "19093_27"
      if (nameWithoutExt.includes(variation)) {
        // Ensure it's not just a substring of another number (e.g. 123 inside 91234)
        const regex = new RegExp(`(^|[^0-9a-zA-Z])${variation}([^0-9a-zA-Z]|$)`, 'i');
        return regex.test(nameWithoutExt);
      }
      
      return false;
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
        
        if (!isImage) return false;
        if (nameWithoutExt === variation) return true;
        
        if (nameWithoutExt.includes(variation)) {
          const regex = new RegExp(`(^|[^0-9a-zA-Z])${variation}([^0-9a-zA-Z]|$)`, 'i');
          return regex.test(nameWithoutExt);
        }
        return false;
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
  configureCloudinary();
  const codeStr = String(code).trim();
  
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      const { blobs: matchingBlobs, matchedVariation } = await findBlobsForCode(codeStr);

      if (matchingBlobs.length > 0) {
        // Sort to ensure consistent order and prioritize the main image
        matchingBlobs.sort((a, b) => {
          const aName = path.basename(a.pathname, path.extname(a.pathname)).toLowerCase();
          const bName = path.basename(b.pathname, path.extname(b.pathname)).toLowerCase();
          
          const getScore = (name: string) => {
            // Prioritize explicit front/main indicators
            if (name.includes('front') || name.includes('frontal') || name.includes('delante') || name.includes('principal')) return 0;
            if (name.match(/[_.-]1([_.-a-z]|$)/i)) return 1;
            
            // Exact match is good, but might be a back/detail if a _1 exists
            if (name === matchedVariation.toLowerCase()) return 2;
            
            // Other numbers
            if (name.match(/[_.-]2([_.-a-z]|$)/i)) return 3;
            if (name.match(/[_.-]3([_.-a-z]|$)/i)) return 4;
            if (name.match(/[_.-]4([_.-a-z]|$)/i)) return 5;
            
            // Explicit back/detail indicators should go last
            if (name.includes('back') || name.includes('espalda') || name.includes('detras') || name.includes('trasera')) return 8;
            if (name.includes('detail') || name.includes('detalle') || name.includes('zoom') || name.includes('cerca')) return 9;
            
            return 6;
          };

          const scoreA = getScore(aName);
          const scoreB = getScore(bName);

          if (scoreA !== scoreB) {
            return scoreA - scoreB;
          }
          
          if (aName.length !== bName.length) {
            return aName.length - bName.length;
          }

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
  
  // Si no tenemos Cloudinary configurado o no se encontraron imágenes, 
  // devolvemos el endpoint de resolución pero sin sobreescribir si ya hay una URL válida en attachBlobImages
  const images = [
    `/api/get-image/${cleanCodeStr}`
  ];
  
  if (cleanCodeStr !== baseCode) {
    images.push(`/api/get-image/${baseCode}`);
  }
  
  return { images, mainImage: images[0] };
}

const app = express();

// Webhook endpoint MUST be before express.json() to handle raw body
app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // Fallback for testing if secret is not set (not recommended for production)
      event = JSON.parse(req.body.toString());
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await handleSuccessfulPayment(session);
  }

  res.json({ received: true });
});

app.use(express.json());

async function handleSuccessfulPayment(session: any) {
  const db = getDbPool();
  if (!db) return;

  const { metadata, customer_email, amount_total, id: sessionId } = session;
  const orderId = metadata.orderId;

  try {
    // 1. Update order status
    const orderResult = await db.query(
      `UPDATE orders 
       SET status = 'paid', 
           stripe_session_id = $1, 
           shipping_address = COALESCE(shipping_address, $2),
           customer_email = COALESCE($3, customer_email)
       WHERE id = $4 OR stripe_session_id = $1
       RETURNING items`,
      [sessionId, session.shipping_details ? JSON.stringify(session.shipping_details) : null, customer_email, orderId]
    );

    if (orderResult.rows.length > 0) {
      const items = orderResult.rows[0].items;
      // 2. Update stock
      for (const item of items) {
        const { code, size, quantity } = item;
        await db.query(
          `UPDATE products 
           SET sizes_stock = sizes_stock || jsonb_build_object($1, (COALESCE((sizes_stock->>$1)::int, 0) - $2))
           WHERE code = $3`,
          [size, quantity, code]
        );
      }
      console.log(`Order ${orderId || sessionId} processed successfully.`);

      // Enviar notificación por email usando Formspree
      try {
        const shippingMethod = metadata?.shippingMethod || 'standard';
        const accumulateOrder = metadata?.accumulateOrder === 'true';
        
        let shippingText = 'Envío Estándar';
        if (shippingMethod === 'store') {
          shippingText = '🏪 RECOGIDA EN TIENDA';
        } else if (accumulateOrder) {
          shippingText = '📦 ACUMULAR PEDIDO (No enviar todavía)';
        } else if (session.shipping_details) {
          const addr = session.shipping_details.address;
          shippingText = `${session.shipping_details.name || ''}\n${addr?.line1 || ''} ${addr?.line2 || ''}\n${addr?.postal_code || ''} ${addr?.city || ''}\n${addr?.country || ''}`;
        }

        const itemsList = items.map((i: any) => `- ${i.quantity}x ${i.name} (Talla: ${i.size})`).join('\n');
        const totalFormatted = session.amount_total ? (session.amount_total / 100).toFixed(2) + '€' : '0.00€';

        await fetch('https://formspree.io/f/xnjoprko', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            "Asunto": `✅ NUEVO PEDIDO PAGADO - #${orderId || sessionId.substring(0, 8)}`,
            "Email_Cliente": customer_email,
            "Total_Pagado": totalFormatted,
            "Metodo_de_Envio": shippingText,
            "Productos": itemsList,
            "ID_Stripe": sessionId
          })
        });
        console.log(`Notificación de Formspree enviada para el pedido ${orderId || sessionId}`);
      } catch (emailErr) {
        console.error("Error al enviar notificación de Formspree:", emailErr);
      }
    }
  } catch (err) {
    console.error("Error processing successful payment:", err);
  }
}

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

import { GoogleGenAI } from "@google/genai";

// ... existing code ...

app.post("/api/admin/run-image-analysis", async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(503).json({ error: "DB not configured" });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { rows: products } = await db.query('SELECT code, name FROM products');
    
    // Get all cloudinary images
    const allBlobs = await getAllCloudinaryImages();
    let analyzedCount = 0;
    let logOutput = "";

    for (const p of products) {
      const codeStr = String(p.code).trim();
      const { blobs: matchingBlobs } = await findBlobsForCode(codeStr);

      // Remove duplicates
      const uniqueBlobs = [];
      const seen = new Set();
      for (const b of matchingBlobs) {
        if (!seen.has(b.url)) {
          seen.add(b.url);
          uniqueBlobs.push(b);
        }
      }

      if (uniqueBlobs.length > 1) {
        logOutput += `Analyzing ${uniqueBlobs.length} images for product ${p.code} (${p.name})...\n`;
        
        try {
          // Fetch images as base64 to send to Gemini
          const imageParts = await Promise.all(uniqueBlobs.map(async (blob) => {
            const response = await fetch(blob.url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return {
              inlineData: {
                data: buffer.toString("base64"),
                mimeType: "image/jpeg"
              }
            };
          }));

          const prompt = `
            You are an expert fashion e-commerce merchandiser.
            I am providing you with ${uniqueBlobs.length} images of the same clothing product.
            Your task is to identify which image is the BEST primary image to show on the store catalog.
            The best primary image is typically:
            1. A front view of the full garment.
            2. NOT a back view.
            3. NOT a zoomed-in detail shot (like just the collar or a pocket).
            4. NOT a lifestyle shot if a clean studio shot is available.
            
            Return ONLY the index (0-indexed) of the best image. For example, if the first image is best, return 0. If the second is best, return 1.
            Do not return any other text.
          `;

          const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [prompt, ...imageParts],
          });

          const bestIndexStr = response.text.trim();
          const bestIndex = parseInt(bestIndexStr);

          if (!isNaN(bestIndex) && bestIndex >= 0 && bestIndex < uniqueBlobs.length) {
            const bestImageUrl = uniqueBlobs[bestIndex].url;
            logOutput += `  -> Best image selected: Index ${bestIndex} (${uniqueBlobs[bestIndex].pathname})\n`;
            
            // Save the best image URL to the database
            await db.query('UPDATE products SET image_url = $1 WHERE code = $2', [bestImageUrl, p.code]);
            analyzedCount++;
          } else {
            logOutput += `  -> Failed to parse index: ${bestIndexStr}\n`;
          }
        } catch (err: any) {
          logOutput += `  -> Error analyzing images for ${p.code}: ${err.message}\n`;
        }
      }
    }

    fs.writeFileSync(path.join(process.cwd(), 'analysis-log.txt'), logOutput);
    res.json({ success: true, analyzedCount, logOutput });
  } catch (err: any) {
    console.error("Error in image analysis:", err);
    res.status(500).json({ error: err.message });
  }
});
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
  configureCloudinary();
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
  const { name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url, local_images } = req.body;
  
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
        image_url = COALESCE($9, image_url),
        local_images = COALESCE($10, local_images),
        updated_at = CURRENT_TIMESTAMP
      WHERE code = $11
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
      image_url,
      local_images ? JSON.stringify(local_images) : null,
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

app.post("/api/products", requireAdmin, async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(503).json({ error: "DB not configured" });
  
  const { code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url, local_images } = req.body;
  
  if (!code || !name) {
    return res.status(400).json({ error: "El código y el nombre son obligatorios" });
  }

  try {
    const query = `
      INSERT INTO products (
        code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url, local_images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      code,
      name, 
      description, 
      color, 
      original_price, 
      discounted_price, 
      brand, 
      category, 
      sizes_stock ? JSON.stringify(sizes_stock) : '{}',
      image_url,
      local_images ? JSON.stringify(local_images) : '[]'
    ];
    
    const result = await db.query(query, values);
    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (err: any) {
    console.error("Error creating product:", err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: "Ya existe un producto con ese código" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/orders", requireAdmin, async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(503).json({ error: "DB not configured" });

  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(503).json({ error: "DB not configured" });

  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = "created_at > CURRENT_DATE - INTERVAL '7 days'";
    const queryParams: any[] = [];
    
    if (startDate && endDate) {
      dateFilter = "created_at >= $1 AND created_at <= $2";
      queryParams.push(startDate, endDate + ' 23:59:59');
    }

    // Get views by day
    const viewsByDayResult = await db.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
        COUNT(*) as views
      FROM page_views
      WHERE ${dateFilter}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `, queryParams);

    // Get top categories and brands
    const topPagesResult = await db.query(`
      SELECT path, COUNT(*) as views
      FROM page_views
      WHERE ${dateFilter} AND (path LIKE '/categoria/%' OR path LIKE '/marca/%')
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `, queryParams);

    // Get total views
    const totalViewsResult = await db.query(`
      SELECT COUNT(*) as total FROM page_views WHERE ${dateFilter}
    `, queryParams);

    // Get all-time total views
    const allTimeTotalViewsResult = await db.query(`
      SELECT COUNT(*) as total FROM page_views
    `);

    res.json({
      success: true,
      data: {
        viewsByDay: viewsByDayResult.rows.map(r => ({ date: r.date, views: parseInt(r.views) })),
        topPages: topPagesResult.rows.map(r => ({ path: r.path, views: parseInt(r.views) })),
        totalViews: parseInt(totalViewsResult.rows[0].total),
        allTimeTotalViews: parseInt(allTimeTotalViewsResult.rows[0].total)
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
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) : null,
    nodeEnv: process.env.NODE_ENV,
    adminPassword: process.env.ADMIN_PASSWORD || 'MALOLAKIDS2026',
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items, shippingCost, customerEmail, shippingMethod, accumulateOrder, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    const db = getDbPool();
    let orderId = null;

    // 1. Create a pending order in the database
    if (db) {
      try {
        const orderResult = await db.query(
          `INSERT INTO orders (customer_email, total_amount, shipping_cost, shipping_method, items, status, shipping_address)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            customerEmail, 
            items.reduce((acc, item) => acc + (Number(item.product.discounted_price) * item.quantity), 0) + shippingCost,
            shippingCost,
            shippingMethod,
            JSON.stringify(items.map(i => ({
              code: i.product.code,
              name: i.product.name,
              size: i.size,
              quantity: i.quantity,
              price: i.product.discounted_price
            }))),
            'pending',
            shippingAddress ? JSON.stringify(shippingAddress) : null
          ]
        );
        orderId = orderResult.rows[0].id;
      } catch (dbErr) {
        console.error("Error creating pending order:", dbErr);
      }
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const lineItems = items.map((item: any) => {
      // Ensure image URL is absolute for Stripe
      let imageUrl = item.product.image_url;
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${appUrl}${imageUrl}`;
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${item.product.name} (Talla: ${item.size})`,
            images: imageUrl ? [imageUrl] : [],
            ...(item.product.description ? { description: item.product.description } : {}),
          },
          unit_amount: Math.round(Number(item.product.discounted_price) * 100),
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Gastos de envío",
            images: [],
            description: "Envío a domicilio",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${appUrl}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
      metadata: {
        orderId: orderId ? String(orderId) : "",
        shippingMethod,
        accumulateOrder: String(accumulateOrder),
      },
      // Optional: Allow Stripe to collect shipping address
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['ES'], // Only Spain for now, or add more
      },
    });

    // Update order with session ID if it was created
    if (db && orderId) {
      await db.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);
    }

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Error Details:", error);
    res.status(500).json({ error: error.message || "Error al conectar con Stripe" });
  }
});

app.get("/api/debug/images", async (req, res) => {
  configureCloudinary();
  try {
    const blobs = await getAllCloudinaryImages();
    res.json({ 
      count: blobs.length, 
      sample: blobs,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint to resolve and redirect to the correct Cloudinary image
app.get("/api/get-image/:code", async (req, res) => {
  configureCloudinary();
  const { code } = req.params;
  const index = parseInt(req.query.index as string) || 0;
  
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      const { blobs: matchingBlobs } = await findBlobsForCode(code);

      // Sort to ensure consistent order and prioritize the main image
      matchingBlobs.sort((a, b) => {
        const aName = path.basename(a.pathname, path.extname(a.pathname)).toLowerCase();
        const bName = path.basename(b.pathname, path.extname(b.pathname)).toLowerCase();
        
        const getScore = (name: string) => {
          // Prioritize explicit front/main indicators
          if (name.includes('front') || name.includes('frontal') || name.includes('delante') || name.includes('principal')) return 0;
          if (name.match(/[_.-]1([_.-a-z]|$)/i)) return 1;
          
          // Exact match is good, but might be a back/detail if a _1 exists
          if (name === code.toLowerCase()) return 2;
          
          // Other numbers
          if (name.match(/[_.-]2([_.-a-z]|$)/i)) return 3;
          if (name.match(/[_.-]3([_.-a-z]|$)/i)) return 4;
          if (name.match(/[_.-]4([_.-a-z]|$)/i)) return 5;
          
          // Explicit back/detail indicators should go last
          if (name.includes('back') || name.includes('espalda') || name.includes('detras') || name.includes('trasera')) return 8;
          if (name.includes('detail') || name.includes('detalle') || name.includes('zoom') || name.includes('cerca')) return 9;
          
          return 6;
        };

        const scoreA = getScore(aName);
        const scoreB = getScore(bName);

        if (scoreA !== scoreB) {
          return scoreA - scoreB;
        }
        
        if (aName.length !== bName.length) {
          return aName.length - bName.length;
        }

        return aName.localeCompare(bName);
      });

      if (matchingBlobs.length > index) {
        return res.redirect(matchingBlobs[index].url);
      } else if (matchingBlobs.length > 0) {
        // Fallback to first image if index is out of bounds
        return res.redirect(matchingBlobs[0].url);
      }
    }
    
    // Fallback if not found or no token - Try to guess Cloudinary URL
    const cleanCode = code.replace(/^26[-_]/, '');
    const guessedUrl = `https://res.cloudinary.com/daom5jnck/image/upload/malola_catalog/26-${cleanCode}.jpg`;
    res.redirect(guessedUrl);
  } catch (error) {
    console.error(`Error fetching image for ${code}:`, error);
    const cleanCode = code.replace(/^26[-_]/, '');
    res.redirect(`https://res.cloudinary.com/daom5jnck/image/upload/malola_catalog/26-${cleanCode}.jpg`);
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
    const result = await db.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL');
    const excludedCategories = ['bebe-nino', 'bebe-nina', 'bano', 'Baño'];
    const allCategories = new Set<string>();
    
    result.rows.forEach(row => {
      if (row.category) {
        row.category.split(',').forEach((c: string) => {
          const cat = c.trim();
          if (cat && !excludedCategories.includes(cat)) {
            allCategories.add(cat);
          }
        });
      }
    });
    
    const categories = Array.from(allCategories).sort();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener categorías" });
  }
});

app.get("/api/debug-cloudinary2", async (req, res) => {
  try {
    configureCloudinary();
    const result: any = await cloudinary.api.resources({
      type: 'upload',
      max_results: 10
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err), stack: err.stack });
  }
});

app.get("/api/debug-cloudinary", async (req, res) => {
  try {
    const blobs = await getAllCloudinaryImages();
    res.json({ count: blobs.length, blobs: blobs.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
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
      // Si el producto ya tiene una imagen válida que no sea el placeholder o el endpoint de resolución, la mantenemos
      const hasValidImage = product.image_url && 
                           product.image_url.startsWith('http') && 
                           !product.image_url.includes('postimg.cc/placeholder') &&
                           !product.image_url.includes('/api/get-image');

      // If the product already has manually set images in the database, use them
      if (product.local_images && Array.isArray(product.local_images) && product.local_images.length > 0) {
        if (!product.image_url || !hasValidImage) {
          product.image_url = product.local_images[0];
        }
        return product;
      }
      
      const { images, mainImage } = await getProductImages(product.code, localFiles);
      
      // Solo sobreescribimos si no hay una imagen válida o si encontramos imágenes reales (no el fallback /api/get-image)
      const foundRealImages = images.length > 0 && !images[0].startsWith('/api/get-image');
      
      if (foundRealImages) {
        product.local_images = images;
        product.image_url = mainImage;
      } else if (!hasValidImage) {
        // Si no hay imagen válida, usamos el fallback de resolución
        product.local_images = images;
        product.image_url = mainImage;
      } else if (product.gallery_urls && Array.isArray(product.gallery_urls) && product.gallery_urls.length > 0) {
        product.local_images = product.gallery_urls;
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
      params.push(`%${category}%`);
      conditions.push(`category ILIKE $${params.length}`);
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
    if (product.local_images && Array.isArray(product.local_images) && product.local_images.length > 0) {
      if (!product.image_url) {
        product.image_url = product.local_images[0];
      }
      return product;
    }
    
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
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
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
