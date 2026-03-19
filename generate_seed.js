import fs from 'fs';

const rawData = `CÓDIGO	ARTÍCULO	TALLA	CATEGORÍA	DESCRIPCIÓN	PVP	COLOR	IMAGEN
32530	PELELE ATARI	1 Mes ( 54 cm)	Calamaro Baby  0-4 años	100% algodón	21,50 €	Arena	32530
32530	PELELE ATARI	3 Meses (60 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Arena	32530
32530	PELELE ATARI	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Arena	32530
32530	PELELE ATARI	12 Meses (74 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Arena	32530
32530	PELELE ATARI	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Arena	32530
32530	PELELE ATARI	24 Meses (86 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Arena	32530
32530	PELELE ATARI	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32530
32530	PELELE ATARI	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32530
32530	PELELE ATARI	12 Meses (74 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32530
32530	PELELE ATARI	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32530
32530	PELELE ATARI	24 Meses (86 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32530
32531	PETO ATARI	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	19,90 €	Arena	32531
32531	PETO ATARI	3 Meses (60 cm)	Bebe niño 0-4 años	100% algodón	19,90 €	Arena	32531
32531	PETO ATARI	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	19,90 €	Arena	32531
32554	PELELE KERALA	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	23,99 €	Celeste	32554
32554	PELELE KERALA	3 Meses (60 cm)	Bebe niño 0-4 años	100% algodón	23,99 €	Celeste	32554
32554	PELELE KERALA	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	23,99 €	Celeste	32554
32554	PELELE KERALA	12 Meses (74 cm)	Bebe niño 0-4 años	100% algodón	23,99 €	Celeste	32554
11314	CONJUNTO POLOLO KERALA	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	25,00 €	Celeste	11314
11314	CONJUNTO POLOLO KERALA	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	25,00 €	Celeste	11314
11314	CONJUNTO POLOLO KERALA	36 Meses (95 cm)	Bebe niño 0-4 años	100% algodón	25,00 €	Celeste	11314
32553	PETO KERALA	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	17,90 €	Celeste	32553
32553	PETO KERALA	3 Meses (60 cm)	Bebe niño 0-4 años	100% algodón	17,90 €	Celeste	32553
32553	PETO KERALA	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	17,90 €	Celeste	32553
32553	PETO KERALA	12 Meses (74 cm)	Bebe niño 0-4 años	100% algodón	17,90 €	Celeste	32553
32553	PETO KERALA	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	17,90 €	Celeste	32553
32553	PETO KERALA	24 Meses (86 cm)	Bebe niño 0-4 años	100% algodón	17,90 €	Celeste	32553
11315	CONJUNTO PETO KERALA	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	27,90 €	Celeste	11315
11315	CONJUNTO PETO KERALA	12 Meses (74 cm)	Bebe niño 0-4 años	100% algodón	27,90 €	Celeste	11315
11315	CONJUNTO PETO KERALA	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	27,90 €	Celeste	11315
11315	CONJUNTO PETO KERALA	24 Meses (86 cm)	Bebe niño 0-4 años	100% algodón	27,90 €	Celeste	11315
32550	PETO KANPUR	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32550
32550	PETO KANPUR	6 Meses (67 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32550
32550	PETO KANPUR	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32550
32550	PETO KANPUR	24 Meses (86 cm)	Bebe niño 0-4 años	100% algodón	21,50 €	Coral	32550
21327-B	VESTIDO CON BRAGUITA KANPUR	12 Meses (74 cm)	Bebe niño 0-4 años	100% algodón	31,90 €	Coral	21327-B
21327-B	VESTIDO CON BRAGUITA KANPUR	18 Meses (81 cm)	Bebe niño 0-4 años	100% algodón	31,90 €	Coral	21327-B
21327-N	VESTIDO CON BRAGUITA KANPUR	3 Años (95 cm)	Bebe niño 0-4 años	100% algodón	39,90 €	Coral	21327-N
32548	PETO BUNDI	1 Mes ( 54 cm)	Bebe niño 0-4 años	78% algodón	19,90 €	Rosa	32548
32548	PETO BUNDI	3 Años (95 cm)	Bebe niño 0-4 años	78% algodón	19,90 €	Rosa	32548
32548	PETO BUNDI	6 Meses (67 cm)	Bebe niño 0-4 años	78% algodón	19,90 €	Rosa	32548
32548	PETO BUNDI	12 Meses (74 cm)	Bebe niño 0-4 años	78% algodón	19,90 €	Rosa	32548
32548	PETO BUNDI	18 Meses (81 cm)	Bebe niño 0-4 años	78% algodón	19,90 €	Rosa	32548
32548	PETO BUNDI	24 Meses (86 cm)	Bebe niño 0-4 años	78% algodón	19,90 €	Rosa	32548
32549	PELELE BUNDI	1 Mes ( 54 cm)	Bebe niño 0-4 años	78% algodón	21,50 €	Rosa	32549
32549	PELELE BUNDI	3 Años (95 cm)	Bebe niño 0-4 años	78% algodón	21,50 €	Rosa	32549
32549	PELELE BUNDI	6 Meses (67 cm)	Bebe niño 0-4 años	78% algodón	21,50 €	Rosa	32549
32549	PELELE BUNDI	12 Meses (74 cm)	Bebe niño 0-4 años	78% algodón	21,50 €	Rosa	32549
32549	PELELE BUNDI	18 Meses (81 cm)	Bebe niño 0-4 años	78% algodón	21,50 €	Rosa	32549
32549	PELELE BUNDI	24 Meses (86 cm)	Bebe niño 0-4 años	78% algodón	21,50 €	Rosa	32459
32497	PELELE ALBORÁN	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	17.90€	Blanco	32497
32497	PELELE ALBORÁN	1 Mes ( 54 cm)	Bebe niño 0-4 años	100% algodón	17.90€	Blanco	32497
32497	PELELE ALBORÁN	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Blanco	32479
32497	PELELE ALBORÁN	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Blanco	32497
32497	PELELE ALBORÁN	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Blanco	32497
32497	PELELE ALBORÁN	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Blanco	32497
32497	PELELE ALBORÁN	3 Años (95 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Arena	32497
32497	PELELE ALBORÁN	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Arena	32497
11277	CONJUNTO POLOLO GOA	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	22.00€	Nude	11277
11277	CONJUNTO POLOLO GOA	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	22.00€	Nude	11277
11277	CONJUNTO POLOLO GOA	36 Meses (95 cm)	Calamaro Baby  0-4 años	100% algodón	22.00€	Nude	11277
32541	PETO MANDI	1 Mes ( 54 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Arena	32541
32541	PETO MANDI	3 Años (95 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Arena	32541
32541	PETO MANDI	36 Meses (95 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Arena	32541
22109	JESUSITO MANDI	1 Mes ( 54 cm)	Calamaro Baby  0-4 años	100% algodón	26,90 €	Arena	22109
22109	JESUSITO MANDI	3 Años (95 cm)	Calamaro Baby  0-4 años	100% algodón	26,90 €	Arena	22109
22109	JESUSITO MANDI	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	26.90€	Arena	22109
22109	JESUSITO MANDI	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	26.90€	Arena	22109
22109	JESUSITO MANDI	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	26.90€	Arena	22109
22109	JESUSITO MANDI	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	26.90€	Arena	22109
22109	JESUSITO MANDI	36 Meses (95 cm)	Calamaro Baby  0-4 años	100% algodón	26.90€	Arena	22109
11286	CONJUNTO POLOLO MANDI	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Arena	11286
11286	CONJUNTO POLOLO MANDI	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Arena	11286
11286	CONJUNTO POLOLO MANDI	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Arena	11286
11286	CONJUNTO POLOLO MANDI	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Arena	11286
77134	LAZO PELO MANDI 	Única	Calamaro Baby  0-4 años	100% algodón	3.90€	Arena	77134
11313-B	CONJUNTO POLOLO MATHURA	1 Mes ( 54 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Verde	11313-B
11313-B	CONJUNTO POLOLO MATHURA	3 Años (95 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Verde	11313-B
11313-B	CONJUNTO POLOLO MATHURA	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Verde	11313-B
11313-B	CONJUNTO POLOLO MATHURA	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	25.00€	Verde	11313-B
11313-N	CONJUNTO POLOLO MATHURA	3 Años (95 cm)	Calamaro Baby  0-4 años	100% algodón	29.90€	Verde	11313-N
32551-B	PETO MATHURA	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	21.90€	Verde	32551-B
32551-B	PETO MATHURA	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	21.90€	Verde	32551-B
32551-B	PETO MATHURA	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	21.90€	Verde	32551-B
33551-B	PETO MATHURA	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	21.90€	Verde	32551-B
33551-N	PETO MATHURA	3 Años (95 cm)	Calamaro Baby  0-4 años	100% algodón	24.90€	Verde	32551-N
11323	CONJUNTO POLOLO DELHI	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	25.90€	Melocotón	11323
11323	CONJUNTO POLOLO DELHI	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	25.90€	Melocotón	11323
11323	CONJUNTO POLOLO DELHI	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	25.90€	Melocotón	11323
11323	CONJUNTO POLOLO DELHI	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	25.90€	Melocotón	11323
21338-B	VESTIDO CUADROS	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	21.50€	Melocotón	21338-B
21338-B	VESTIDO CUADROS	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	21.50€	Melocotón	21338-B
21338-B	VESTIDO CUADROS	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	21.50€	Melocotón	21338-B
32544	PETO GAYA	1 Mes ( 54 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Mostaza	21338-B
32544	PETO GAYA	6 Meses (67 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Mostaza	32544
32544	PETO GAYA	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Mostaza	32544
32544	PETO GAYA	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Mostaza	32544
32544	PETO GAYA	36 Meses (95 cm)	Calamaro Baby  0-4 años	100% algodón	17.90€	Mostaza	32544
21324-B	VESTIDO GAYA	12 Meses (74 cm)	Calamaro Baby  0-4 años	100% algodón	24.50€	Mostaza	21324-B
21324-B	VESTIDO GAYA	18 Meses (81 cm)	Calamaro Baby  0-4 años	100% algodón	24.50€	Mostaza	21324-B
21324-B	VESTIDO GAYA	24 Meses (86 cm)	Calamaro Baby  0-4 años	100% algodón	24.50€	Mostaza	21324-B
32542	PETO SIKAR	6 Meses (67 cm)	Calamaro Baby  0-4 años	95%algodón	19.50€	Coral	32542
32542	PETO SIKAR	12 Meses (74 cm)	Calamaro Baby  0-4 años	95 %algodón	19.50€	Coral	32542
32542	PETO SIKAR	18 Meses (81 cm)	Calamaro Baby  0-4 años	95 %algodón	19.50€	Coral	32542
32542	PETO SIKAR	24 Meses (86 cm)	Calamaro Baby  0-4 años	95 %algodón	19.50€	Coral	32542`;

const lines = rawData.trim().split('\n').slice(1);
const products = new Map();

for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length < 8) continue;
  
  const [codigo, articulo, talla, categoria, descripcion, pvpStr, color, imagen] = parts;
  const code = codigo.trim();
  
  if (!products.has(code)) {
    let finalCategory = categoria.trim();
    const upperCode = code.toUpperCase();
    if (upperCode.endsWith('-B')) finalCategory = 'Bebé';
    else if (upperCode.endsWith('-N')) finalCategory = 'Niños';

    let brand = 'Calamaro'; // Todo es de Calamaro según el usuario

    // Parse price: "21,50 €" -> 21.50
    const pvpNum = parseFloat(pvpStr.replace('€', '').replace(',', '.').trim());
    const discounted = pvpNum; // No discount

    products.set(code, {
      code,
      name: articulo.trim(),
      description: descripcion.trim(),
      color: color.trim(),
      original_price: pvpNum,
      discounted_price: discounted,
      brand,
      category: finalCategory,
      sizes_stock: {},
      image_url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });
  }

  const prod = products.get(code);
  // Default stock to 5 since it wasn't provided in the TSV
  prod.sizes_stock[talla.trim()] = 5; 
}

let sql = '-- Seed data for Malola Catalog\n';
sql += 'INSERT INTO products (code, name, description, color, original_price, discounted_price, brand, category, sizes_stock, image_url) VALUES\n';

const values = [];
for (const p of products.values()) {
  const sizesJson = JSON.stringify(p.sizes_stock).replace(/'/g, "''");
  const name = p.name.replace(/'/g, "''");
  const desc = p.description.replace(/'/g, "''");
  const color = p.color.replace(/'/g, "''");
  const brand = p.brand.replace(/'/g, "''");
  const cat = p.category.replace(/'/g, "''");
  
  values.push(`('${p.code}', '${name}', '${desc}', '${color}', ${p.original_price.toFixed(2)}, ${p.discounted_price.toFixed(2)}, '${brand}', '${cat}', '${sizesJson}'::jsonb, '${p.image_url}')`);
}

sql += values.join(',\n') + '\nON CONFLICT (code) DO UPDATE SET sizes_stock = EXCLUDED.sizes_stock, original_price = EXCLUDED.original_price, discounted_price = EXCLUDED.discounted_price, color = EXCLUDED.color;\n';

fs.writeFileSync('catalog_seed.sql', sql);
console.log('SQL generated successfully in catalog_seed.sql');
