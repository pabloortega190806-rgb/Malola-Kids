import http from 'http';
import fs from 'fs';
import path from 'path';

function getCloudinaryBlobs() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/debug-cloudinary', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.blobs || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getProducts() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/products?limit=1000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.data || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function checkMissingImages() {
  try {
    console.log("Fetching products and their assigned images from the API...");
    const products = await getProducts();
    console.log(`Found ${products.length} products.`);
    
    const missing = [];
    
    for (const product of products) {
      // The API attaches local_images and image_url.
      // If the image_url is the fallback one (e.g. /api/get-image/CODE)
      // AND local_images only has 1 item which is also the fallback,
      // it means no real image was found in Cloudinary.
      
      const hasRealImage = product.local_images && product.local_images.length > 0 && 
                           product.local_images.some(url => url.includes('?index=') || url.includes('cloudinary') || url.includes('postimg'));
                           
      // Actually, if it finds a blob, it returns `/api/get-image/${matchedVariation}?index=${index}`
      // If it doesn't find a blob, it returns `/api/get-image/${cleanCodeStr}` (without ?index=)
      
      const hasBlobImage = product.local_images && product.local_images.some(url => url.includes('?index='));
      const hasGalleryImage = product.gallery_urls && product.gallery_urls.length > 0;
      
      if (!hasBlobImage && !hasGalleryImage) {
        missing.push(product.code);
      }
    }
    
    console.log(`\n--- RESULTADOS ---`);
    console.log(`Total productos: ${products.length}`);
    console.log(`Productos sin imagen en Cloudinary: ${missing.length}`);
    console.log(`\nCódigos sin imagen asignada:`);
    console.log(missing.join(', '));
    
  } catch (error) {
    console.error("Error:", error);
  }
}

checkMissingImages();
