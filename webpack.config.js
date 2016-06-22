var path = require('path');
console.log(path.resolve(__dirname, 'libs'));

module.exports = {
    entry: "./js/main.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
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
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.es6']
    }
}
