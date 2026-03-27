import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "daom5jnck", 
  api_key: process.env.CLOUDINARY_API_KEY || "159654824825549", 
  api_secret: process.env.CLOUDINARY_API_SECRET || "mqrpVaFqzeYW9HnprvElLH39dNg" 
});

async function run() {
  const result = await cloudinary.search
    .sort_by('created_at', 'desc')
    .max_results(50)
    .execute();
  console.log(JSON.stringify(result.resources.map(r => ({ 
    public_id: r.public_id, 
    url: r.secure_url, 
    created_at: r.created_at,
    filename: r.filename
  })), null, 2));
}

run();
