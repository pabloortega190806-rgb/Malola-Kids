async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/products?limit=1000');
    const data = await res.json();
    const products = data.data;
    
    console.log(`Total products: ${products.length}`);
    let missingCount = 0;
    let missingProducts = [];
    let foundCount = 0;
    
    // Check in batches to avoid overwhelming the server
    const batchSize = 20;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Promise.all(batch.map(async (p) => {
        try {
          const imgRes = await fetch(`http://localhost:3000/api/get-image/${p.code}`, { redirect: 'manual' });
          const location = imgRes.headers.get('location');
          if (location && location.includes('placeholder')) {
            missingCount++;
            missingProducts.push(p.code);
          } else {
            foundCount++;
          }
        } catch (e) {
          console.error(`Error checking ${p.code}:`, e.message);
        }
      }));
      process.stdout.write(`\rChecked ${Math.min(i + batchSize, products.length)}/${products.length}...`);
    }
    
    console.log(`\n\nTotal products without images: ${missingCount}`);
    console.log(`Total products WITH images: ${foundCount}`);
    console.log(`Some missing codes:`, missingProducts.slice(0, 10));
  } catch (e) {
    console.error(e);
  }
}

main();
