import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function searchImages() {
  try {
    const result = await cloudinary.search
      .expression('folder:""') // get recent
      .sort_by('created_at', 'desc')
      .max_results(10)
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

searchImages();
