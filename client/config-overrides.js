const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    // Add your webpack aliases here
    '@components': path.resolve(__dirname, 'src/components'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@context': path.resolve(__dirname, 'src/context'),
    '@img': path.resolve(__dirname, 'src/img'),
    '@providers': path.resolve(__dirname, 'src/providers'),
    '@css': path.resolve(__dirname, 'src/css'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@mp3': path.resolve(__dirname, 'src/mp3'),
    '@fonts': path.resolve(__dirname, 'src/fonts'),
  })
);