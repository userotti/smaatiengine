/*  Copyright 2012-2016 Sven "underscorediscovery" Bergström

written by : http://underscorediscovery.ca
written for : http://buildnewgames.com/real-time-multiplayer/

MIT Licensed.

Usage : node app.js
*/

var
gameport        = process.env.PORT || 4004,
io              = require('socket.io'),
express         = require('express'),
UUID            = require('node-uuid'),
verbose         = false,
http            = require('http'),
app             = express(),
server          = http.createServer(app);

import { GamesManager } from './es6-game.server.js';


server.listen(gameport)
console.log('\t :: Express :: Listening on port ' + gameport );

app.get( '/', function( req, res ){
  console.log('trying to load %s', __dirname + '/index.html');
  res.sendfile( '/index.html' , { root:__dirname });
});


app.get( '/*' , function( req, res, next ) {
  var file = req.params[0];
  if(verbose) console.log('\t :: Express :: file requested : ' + file);
  res.sendfile( __dirname + '/' + file );
});

/* Socket.IO server set up. */

//Express and socket.io can work together to serve the socket.io client files for you.
//This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.

//Create a socket.io instance using our express server
var sio = io.listen(server);

var game_server = new GamesManager();

sio.sockets.on('connection', function (client) {

  client.userid = UUID();
  client.emit('onconnected', { id: client.userid } );

  game_server.findGame(client);
  console.log('\t socket.io:: player ' + client.userid + ' connected');

  client.on('message', function(m) {
    game_server.onMessage(client, m);
  });

  client.on('disconnect', function () {
    console.log('\t socket.io:: client disconnected ' + client.userid + ' ' + client.game_id);
    if(client.game && client.game.id) {
      game_server.endGame(client.game.id, client.userid);
    }
  });

});
