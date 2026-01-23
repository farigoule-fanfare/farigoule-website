const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://server:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    })
  );
  
  app.use(
    '/public',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://server:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/public': '/public',
      },
    })
  );
};
