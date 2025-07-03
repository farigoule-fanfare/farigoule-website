const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    // Add your webpack aliases here
    "@":         path.resolve(__dirname, "src"),
    "@assets":   path.resolve(__dirname, "src/assets"),
    '@features': path.resolve(__dirname, "src/features"),
    '@shell':    path.resolve(__dirname, "src/shell"),
    "@services": path.resolve(__dirname, "src/services"),
  })
);