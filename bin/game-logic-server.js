var path = require('path');
var express = require('express');

var app = express();

var allowCrossDomain = function(re, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.get('*', function(req, res) {
  res.send('Hello World!');
});

app.listen(5001, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:5001');
});
