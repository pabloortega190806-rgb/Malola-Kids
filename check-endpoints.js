import http from 'http';

const endpoints = [
  '/api/products?limit=1',
  '/api/health',
  '/'
];

async function checkEndpoints() {
  for (const endpoint of endpoints) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${endpoint}`, (res) => {
        console.log(`[${res.statusCode}] GET ${endpoint}`);
        res.resume(); // Consume response data to free up memory
        resolve();
      }).on('error', (e) => {
        console.error(`[ERROR] GET ${endpoint}: ${e.message}`);
        resolve();
      });
    });
  }
}

checkEndpoints();
