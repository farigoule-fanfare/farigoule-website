let BASE_URL = process.env.FRONTEND_URL || 'localhost:3000';
if (!/^https?:\/\//i.test(BASE_URL)) {
  BASE_URL = `https://${BASE_URL}`;
}

const routes = ['/', '/nous', '/contact', '/symphonies', '/portraits'];

const sitemapController = {
  /**
   * GET /sitemap.xml
   * Return a basic XML sitemap for public pages
   */
  getSitemap: (_req, res) => {
    const urls = routes.map(r => `  <url><loc>${BASE_URL}${r}</loc></url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    res.status(200).type('application/xml').send(xml);
  }
};

module.exports = sitemapController;