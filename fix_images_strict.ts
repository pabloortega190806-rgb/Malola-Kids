import { Pool } from 'pg';
import path from 'path';
import * as cloudinary from 'cloudinary';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Configure Cloudinary
const configureCloudinary = () => {
  (cloudinary as any).v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
};

async function getAllCloudinaryImages() {
  configureCloudinary();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return [];
  
  try {
    let allResources: any[] = [];
    let nextCursor = null;
    
    do {
      const result: any = await (cloudinary as any).v2.api.resources({
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
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}

async function run() {
  const allBlobs = await getAllCloudinaryImages();
  console.log(`Found ${allBlobs.length} images in Cloudinary.`);

  const res = await pool.query('SELECT code, name FROM products');
  const products = res.rows;
  console.log(`Processing ${products.length} products...`);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const product of products) {
    const code = product.code;
    const codeStr = String(code).trim();
    let cleanCodeStr = codeStr;
    if (cleanCodeStr.startsWith('26-') || cleanCodeStr.startsWith('26_')) {
      cleanCodeStr = cleanCodeStr.substring(3);
    }
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
    if (cleanCodeStr.includes('.')) {
      const parts = cleanCodeStr.split('.');
      if (parts.length === 2) {
        variations.push(`26-${parts[0].padStart(5, '0')}-${parts[1].padStart(3, '0')}`);
        variations.push(`26-${parts[0]}-${parts[1]}`);
        variations.push(`${parts[0]}-${parts[1]}`);
      }
    }

    let foundImage = null;
    for (const variation of variations) {
      const match = allBlobs.find(blob => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const nameWithoutExt = path.basename(blob.pathname, ext);
        if (nameWithoutExt === variation) return true;
        if (nameWithoutExt.startsWith(variation)) {
          const suffix = nameWithoutExt.substring(variation.length);
          return suffix === '' || /^[-_. ]/.test(suffix);
        }
        return false;
      });
      if (match) {
        foundImage = match.url;
        break;
      }
    }

    if (foundImage) {
      await pool.query('UPDATE products SET image_url = $1 WHERE code = $2', [foundImage, code]);
      updatedCount++;
    } else {
      // If no image found, set to a generic placeholder or keep current if it's not a generic one
      // But user wants "según el código", so if it's not found, better show a specific placeholder
      const placeholder = `https://res.cloudinary.com/daom5jnck/image/upload/malola_catalog/26-${cleanCodeStr}.jpg`;
      await pool.query('UPDATE products SET image_url = $1 WHERE code = $2', [placeholder, code]);
      notFoundCount++;
    }
  }

  console.log(`Update complete. Updated: ${updatedCount}, Guessed/Placeholder: ${notFoundCount}`);
  await pool.end();
}

run().catch(console.error);
