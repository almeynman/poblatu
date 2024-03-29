const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};

fs.readdirSync('node_modules').
  filter(x => ['.bin'].indexOf(x) === -1).
  forEach(mod => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  target: 'node',
  cache: false,
  context: __dirname,
  debug: false,
  devtool: 'source-map',
  entry: ['../src/server'],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'server.js'
  },
  plugins: [
    new webpack.DefinePlugin({ __CLIENT__: false, __SERVER__: true, __PRODUCTION__: true, __DEV__: false }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } })
  ],
  module: {
    preLoaders: [
      { test: /\.js?$/, loaders: ['eslint'], include: path.join(__dirname, '../src') }
    ],
    loaders: [
      { test: /\.json$/, loaders: ['json'] }
    ],
    postLoaders: [
      { test: /\.js$/, loaders: ['babel?presets[]=es2015&presets[]=stage-0&presets[]=react'], exclude: /node_modules/ }
    ],
    noParse: /\.min\.js/
  },
  externals: nodeModules,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
      'web_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  eslint: {
    failOnError: true
  },
  node: {
    __dirname: true,
    fs: 'empty'
  }
};
