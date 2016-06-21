var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'dist');
var mainPath = path.resolve(__dirname, 'public', 'app', 'main.js');

console.log(path.resolve(__dirname, 'libs'));



module.exports = {
  entry: [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:8080',

    // Our application
    mainPath],
    output: {

      // We need to give Webpack a path. It does not actually need it,
      // because files are kept in memory in webpack-dev-server, but an
      // error will occur if nothing is specified. We use the buildPath
      // as that points to where the files will eventually be bundled
      // in production
      path: buildPath,
      filename: 'bundle.js',

      // Everything related to Webpack should go through a build path,
      // localhost:3000/build. That makes proxying easier to handle
      publicPath: '/build/'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: [/libs/, /node_modules/],
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },

      ]
    },

    resolve: {
      extensions: ['', '.js', '.es6']
    },

    plugins: [new Webpack.HotModuleReplacementPlugin()],

    watch: true,
  }
