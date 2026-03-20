async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(url, res.status);
  } catch (e) {
    console.error(url, e.message);
  }
}
checkUrl('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2070&auto=format&fit=crop');
checkUrl('https://images.unsplash.com/photo-1522771731470-ea13095653bd?q=80&w=2070&auto=format&fit=crop');
checkUrl('https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop');
