import https from 'https';

https.get('https://ais-pre-hxrumk6rcwn65q3qzg3dug-77273498245.europe-west2.run.app/api/debug-env', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
});
