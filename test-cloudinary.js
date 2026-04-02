import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 10
    });
    console.log("Resources:", result.resources.map(r => r.public_id));
  } catch (e) {
    console.error(e);
  }
}

test();
