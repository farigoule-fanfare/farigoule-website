const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    // Add your webpack aliases here
    "@":        path.resolve(__dirname, "src"),
    "@assets":  path.resolve(__dirname, "src/assets"),
    "@hooks":   path.resolve(__dirname, "src/hooks"),
    "@services":path.resolve(__dirname, "src/services"),
    "@components": path.resolve(__dirname, "src/components"),
    '@context': path.resolve(__dirname, 'src/context'),
    '@providers': path.resolve(__dirname, 'src/providers'),
  })
);