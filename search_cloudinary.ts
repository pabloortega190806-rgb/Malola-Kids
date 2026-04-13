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
      .expression('pelele atari beig')
      .execute();
    console.log(result.resources);
  } catch (e) {
    console.error(e);
  }
}

searchImage();
