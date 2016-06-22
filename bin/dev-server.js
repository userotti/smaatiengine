import path from 'path';
import express from 'express';
import webpack from 'webpack';
import http from 'http';
import fs from 'fs';
import request from 'request';
var ROOT_PATH = path.resolve(__dirname, '..');

const config = require('../webpack.config.babel').default;

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
    request(config.output.publicPath + 'index.html')
    .pipe(res);
});

var httpServer = http.createServer(app);
httpServer.listen(3001);
console.log('Listening at http://0.0.0.0:3001');
