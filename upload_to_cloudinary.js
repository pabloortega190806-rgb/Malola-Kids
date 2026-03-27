import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Cloudinary con las variables de entorno
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck", 
  api_key: process.env.CLOUDINARY_API_KEY || "159654824825549", 
  api_secret: process.env.CLOUDINARY_API_SECRET || "mqrpVaFqzeYW9HnprvElLH39dNg" 
});

const IMAGES_DIR = path.join(process.cwd(), 'public', 'products');

async function uploadImages() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck";
  if (!cloudName) {
    console.error("❌ Faltan las credenciales de Cloudinary en el archivo .env");
    console.log("Asegúrate de tener: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ El directorio ${IMAGES_DIR} no existe. Coloca tus imágenes ahí primero.`);
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
  });

  console.log(`🔍 Encontradas ${files.length} imágenes para subir a Cloudinary...`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    
    try {
      console.log(`Subiendo ${file}...`);
      // Subimos la imagen usando su nombre original como public_id
      // Esto permite que el backend la encuentre fácilmente
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: fileNameWithoutExt,
        folder: 'malola_catalog', // Carpeta opcional en Cloudinary
        overwrite: true,
        resource_type: "image",
        fetch_format: "auto",
        quality: "auto"
      });
      
      console.log(`✅ Subida exitosa: ${result.secure_url}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error al subir ${file}:`, error.message || error);
      errorCount++;
    }
  }

  console.log("\n--- Resumen de Subida ---");
  console.log(`✅ Subidas exitosas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log("-------------------------");
}

uploadImages();
