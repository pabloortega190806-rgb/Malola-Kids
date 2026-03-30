async function run() {
  const res = await fetch('http://localhost:3000/api/products?limit=1000');
  const data = await res.json();
  const products = data.data;
  
  let missing = [];
  let found = 0;
  
  for (const p of products) {
    const imgRes = await fetch(`http://localhost:3000/api/get-image/${p.code}`, { redirect: 'manual' });
    const location = imgRes.headers.get('location');
    if (location && location.includes('placeholder')) {
      missing.push(p.code);
    } else {
      found++;
    }
  }
  
  console.log(`Found: ${found}, Missing: ${missing.length}`);
  console.log(`Missing codes: ${missing.join(', ')}`);
}
run();
