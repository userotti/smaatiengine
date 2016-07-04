import path from 'path';
import HtmlwebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
console.log(path.resolve(__dirname, 'libs'));

var webpackConfig = {
  devtool: ['eval', 'eval-source-map'],
  entry: ["babel-polyfill", "./js/main.js", 'webpack-hot-middleware/client'],
  output: {
    path: __dirname + "dist",
    filename: "bundle.js",
    publicPath: "http://localhost:3001/"
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
      {
        test: /\.(ogg|mp3)$/i, loader: 'file-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [ 'file-loader?hash=sha512&digest=hex&name=img/[name].[ext]' ]
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: 'html!./template.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
}

export default webpackConfig;
