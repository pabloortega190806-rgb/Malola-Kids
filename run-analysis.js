import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import pg from "pg";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

const { Pool } = pg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const { rows: products } = await pool.query('SELECT code, name FROM products');
  
  let allResources = [];
  let nextCursor = null;
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      next_cursor: nextCursor
    });
    allResources.push(...result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  const allBlobs = allResources.map(res => {
    const filename = res.public_id.split('/').pop();
    const cleanFilename = filename.replace(/_[a-z0-9]{6}$/i, '');
    return {
      pathname: cleanFilename + '.' + (res.format || 'jpg'),
      url: res.secure_url
    };
  });

  for (const p of products) {
    const codeStr = String(p.code).trim();
    let cleanCodeStr = codeStr;
    if (cleanCodeStr.startsWith('26-') || cleanCodeStr.startsWith('26_')) {
      cleanCodeStr = cleanCodeStr.substring(3);
    }
    const alphanumericOnly = cleanCodeStr.replace(/[^a-zA-Z0-9]/g, '');
    
    const variations = [
      `26-${cleanCodeStr}`,
      `26_${cleanCodeStr}`,
      cleanCodeStr,
      cleanCodeStr.replace(/[-.]/g, '_'),
      cleanCodeStr.replace(/[_.]/g, '-'),
      alphanumericOnly,
      `26-${alphanumericOnly}`,
      `26_${alphanumericOnly}`
    ];

    let matchingBlobs = [];
    for (const variation of variations) {
      const matches = allBlobs.filter(blob => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const nameWithoutExt = path.basename(blob.pathname, ext);
        if (nameWithoutExt === variation) return true;
        if (nameWithoutExt.includes(variation)) {
          const regex = new RegExp(`(^|[^0-9a-zA-Z])${variation}([^0-9a-zA-Z]|$)`, 'i');
          return regex.test(nameWithoutExt);
        }
        return false;
      });
      if (matches.length > 0) {
        matchingBlobs = matches;
        break;
      }
    }

    const uniqueBlobs = [];
    const seen = new Set();
    for (const b of matchingBlobs) {
      if (!seen.has(b.url)) {
        seen.add(b.url);
        uniqueBlobs.push(b);
      }
    }

    if (uniqueBlobs.length > 1) {
      console.log(`Analyzing ${uniqueBlobs.length} images for product ${p.code} (${p.name})...`);
      
      try {
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
          model: 'gemini-1.5-pro',
          contents: [prompt, ...imageParts],
        });

        const bestIndexStr = response.text.trim();
        const bestIndex = parseInt(bestIndexStr);

        if (!isNaN(bestIndex) && bestIndex >= 0 && bestIndex < uniqueBlobs.length) {
          const bestImageUrl = uniqueBlobs[bestIndex].url;
          console.log(`  -> Best image selected: Index ${bestIndex} (${uniqueBlobs[bestIndex].pathname})`);
          await pool.query('UPDATE products SET image_url = $1 WHERE code = $2', [bestImageUrl, p.code]);
        } else {
          console.log(`  -> Failed to parse index: ${bestIndexStr}`);
        }
      } catch (err) {
        console.error(`  -> Error analyzing images for ${p.code}:`, err.message);
      }
    }
  }

  console.log("Analysis complete!");
  await pool.end();
}

run().catch(console.error);
