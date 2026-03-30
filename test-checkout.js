import http from 'http';

const postData = JSON.stringify({
  items: [
    {
      product: {
        code: "123",
        name: "Test Product",
        discounted_price: "10.00",
        image_url: "http://example.com/image.jpg"
      },
      size: "M",
      quantity: 1
    }
  ],
  shippingCost: 5.50,
  customerEmail: "test@example.com",
  shippingMethod: "home",
  accumulateOrder: false,
  shippingAddress: {
    firstName: "Test",
    lastName: "User",
    address: "123 Test St",
    city: "Test City",
    postalCode: "12345",
    phone: "123456789"
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/create-checkout-session',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
});

req.on('error', (e) => { console.error(e); });
req.write(postData);
req.end();
