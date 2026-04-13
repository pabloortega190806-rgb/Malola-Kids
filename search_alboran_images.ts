import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function searchImage() {
  try {
    const result = await cloudinary.search
      .expression('32497')
      .sort_by('created_at', 'desc')
      .execute();
    console.log(result.resources.map((r: any) => ({
      url: r.secure_url,
      created_at: r.created_at,
      filename: r.filename
    })));
  } catch (e) {
    console.error(e);
  }
}

searchImage();
