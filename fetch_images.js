import fetch from 'node-fetch';

async function run() {
  const res = await fetch('http://localhost:3000/api/debug/images');
  const data = await res.json();
  // Sort by url or somehow find the ones uploaded recently
  // The debug endpoint returns the cached images.
  // Let's print the last 20 images in the array, or search for 'image_'
  const sample = data.sample.filter(img => img.pathname.toLowerCase().includes('image'));
  console.log(JSON.stringify(sample, null, 2));
}

run();
