export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/sitemap.xml') {
      const response = await fetch('https://www.mhktech.dev/sitemap.xml');
      return new Response(response.body, {
        status: 200,
        headers: { 'Content-Type': 'text/xml; charset=utf-8' }
      });
    }
    return fetch(request);
  }
};
