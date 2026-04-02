import pg from "pg";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const { Pool } = pg;

async function getAllCloudinaryImages() {
  try {
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
    
    return allResources.map(res => {
      const filename = res.public_id.split('/').pop();
      const cleanFilename = filename.replace(/_[a-z0-9]{6}$/i, '');
      return {
        pathname: cleanFilename + '.' + (res.format || 'jpg'),
        url: res.secure_url
      };
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  const result = await pool.query('SELECT code, name FROM products');
  const products = result.rows;
  await pool.end();
  
  const allBlobs = await getAllCloudinaryImages();
  
  const missing = [];
  
  for (const product of products) {
    const codeStr = String(product.code).trim();
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

    let found = false;
    for (const variation of variations) {
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
        found = true;
        break;
      }
    }

    if (!found && cleanCodeStr !== baseCode) {
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
          found = true;
          break;
        }
      }
    }

    if (!found) {
      const similarProducts = products.filter(p => p.name === product.name && p.code !== product.code);
      for (const similarProduct of similarProducts) {
        let cleanSimilarCode = String(similarProduct.code).trim();
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
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found) {
      missing.push(product.code);
    }
  }
  
  console.log(`\n--- RESULTADOS ---`);
  console.log(`Total productos en DB: ${products.length}`);
  console.log(`Imágenes en Cloudinary: ${allBlobs.length}`);
  console.log(`Productos SIN imagen: ${missing.length}`);
  console.log(`\nCódigos sin imagen asignada:`);
  console.log(missing.join(', '));
}

run().catch(console.error);
