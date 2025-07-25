const router = require('express').Router();
const ctrl = require('../controllers/sitemapController');

router.get('/sitemap.xml', ctrl.getSitemap);

module.exports = router;
