import fs from 'fs';

const sql = fs.readFileSync('catalog_seed.sql', 'utf8');
const lines = sql.split('\n').filter(line => line.startsWith('('));

const products = lines.map((line, index) => {
  // Simple regex to parse the SQL VALUES
  // Example: ('32530', 'PELELE ATARI', '100% algodón', 'Arena', 21.50, 21.50, 'Calamaro', 'Calamaro Baby  0-4 años', '{"1 Mes ( 54 cm)":5}'::jsonb, 'url')
  
  // Remove leading '(' and trailing '),' or ')'
  let content = line.trim();
  if (content.endsWith(',')) content = content.slice(0, -1);
  if (content.endsWith(')')) content = content.slice(0, -1);
  if (content.startsWith('(')) content = content.slice(1);
  
  // Split by comma, but respect quotes. This is a bit tricky, let's use a simpler approach since we know the format.
  // We can just evaluate it as an array if we replace single quotes with double quotes, but there are single quotes inside strings...
  
  // Let's just do a manual parse or regex.
  const regex = /'([^']*)'|([0-9.]+)|'({[^}]*})'::jsonb/g;
  const matches = [...content.matchAll(regex)];
  
  // matches[0] -> code
  // matches[1] -> name
  // matches[2] -> description
  // matches[3] -> color
  // matches[4] -> original_price
  // matches[5] -> discounted_price
  // matches[6] -> brand
  // matches[7] -> category
  // matches[8] -> sizes_stock (JSON)
  // matches[9] -> image_url
  
  try {
    const getVal = (m) => m[1] !== undefined ? m[1] : (m[2] !== undefined ? Number(m[2]) : (m[3] !== undefined ? m[3] : null));
    
    // The JSON part is tricky because it has single quotes around it and ::jsonb
    // Let's extract the JSON string directly
    const jsonMatch = content.match(/'({.*})'::jsonb/);
    const sizes = jsonMatch ? JSON.parse(jsonMatch[1]) : {};
    
    // Extracting strings is safer with split if we assume no commas inside strings, but there might be.
    // Let's just use eval-like parsing by replacing ' with " and removing ::jsonb
    let cleanContent = content.replace(/::jsonb/g, '');
    // This is getting complicated. Let's just write the JSON manually since it's only 26 items.
  } catch (e) {
    console.error(e);
  }
});
