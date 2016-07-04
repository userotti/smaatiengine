// require('../../shared/game.core.js');
import { Logger } from '../../shared/logger.js';
require('node-uuid');

var TAG = 'GamesManager';

export class GamesManager {

    constructor(){

      this.verbose = true;
      this.fake_latency = 0;
      this.local_time = 0;
      this._dt = new Date().getTime();
      this._dte = new Date().getTime();
      this.messages = [];

      setInterval(()=>{
        this._dt = new Date().getTime() - this._dte;
        this._dte = new Date().getTime();
        this.local_time += this._dt/1000.0;
      }, 4);

    }

    onMessage(client, message) {
      Logger.log('message: ', message);
      if(this.fake_latency && message.split('.')[0].substr(0,1) == 'i') {
        this.messages.push({client:client, message:message});

        setTimeout(()=>{
          if(this.messages.length) {
            this.processMessage( this.messages[0].client, this.messages[0].message );
            this.messages.splice(0,1);
          }
        }, this.fake_latency);

      } else {
        this.processMessage(client, message);
      }
    }

    processMessage(client,message) {

      var message_parts = message.split('.');
      var message_type = message_parts[0];

      var other_client =
      (client.game.player_host.userid == client.userid) ?
      client.game.player_client : client.game.player_host;

      if(message_type == 'i') {
        //Input handler will forward this
        this.onInput(client, message_parts);
      } else if(message_type == 'p') {
        client.send('s.p.' + message_parts[1]);
      } else if(message_type == 'c') {    //Client changed their color!
        if(other_client)
        other_client.send('s.c.' + message_parts[1]);
      } else if(message_type == 'l') {    //A client is asking for lag simulation
        this.fake_latency = parseFloat(message_parts[1]);
      }

    }

    onInput(client, parts) {
      var input_commands = parts[1].split('-');
      var input_time = parts[2].replace('-','.');
      var input_seq = parts[3];

      if(client && client.game && client.game.gamecore) {
        client.game.gamecore.handle_server_input(client, input_commands, input_time, input_seq);
      }
    };

    createGame(player) {

      var fresh_game = {
        id : UUID(),                //generate a new id for the game
        player_host:player,         //so we know who initiated the game
        player_client:null,         //nobody else joined yet, since its new
        player_count:1              //for simple checking of state
      };

      this.games[ fresh_game.id ] = fresh_game;
      this.game_count++;

      //fresh_game.gamecore = new game_core( fresh_game );
      fresh_game.gamecore.update( new Date().getTime() );

      //tell the player that they are now the host
      //s=server message, h=you are hosting

      player.send('s.h.'+ String(fresh_game.gamecore.local_time).replace('.','-'));
      console.log('server host at  ' + fresh_game.gamecore.local_time);
      player.game = fresh_game;
      player.hosting = true;

      this.log('player ' + player.userid + ' created a game with id ' + player.game.id);
      return fresh_game;

    };

    endGame(gameid, userid) {

      var game = this.games[gameid];

      if(game) {

        game.gamecore.stop_update();
        //if the game has two players, the one is leaving
        if(ending_game.player_count > 1) {
          //send the players the message the game is ending
          if(userid == ending_game.player_host.userid) {
            //the host left, oh snap. Lets try join another game
            if(ending_game.player_client) {
              //tell them the game is over
              ending_game.player_client.send('s.e');
              //now look for/create a new game.
              this.findGame(ending_game.player_client);
            }

          } else {
            //the other player left, we were hosting
            if(ending_game.player_host) {
              //tell the client the game is ended
              ending_game.player_host.send('s.e');
              //i am no longer hosting, this game is going down
              ending_game.player_host.hosting = false;
              //now look for/create a new game.
              this.findGame(ending_game.player_host);
            }
          }
        }

        delete this.games[gameid];
        this.game_count--;

        this.log('game removed. there are now ' + this.game_count + ' games' );

      } else {
        this.log('that game was not found!');
      }

    };

    startGame(game){

      //tell the other client they are joining a game
      //s=server message, j=you are joining, send them the host id
      game.player_client.send('s.j.' + game.player_host.userid);
      game.player_client.game = game;

      //now we tell players that the game is ready to start
      //clients will reset their positions in this case.
      game.player_client.send('s.r.'+ String(game.gamecore.local_time).replace('.','-'));
      game.player_host.send('s.r.'+ String(game.gamecore.local_time).replace('.','-'));

      //set this flag, so that the update loop can run it.
      game.active = true;

    };

    findGame(player){

      this.log('looking for a game. We have : ' + this.game_count);
      if(this.game_count) {
        var joined_a_game = false;

        for(var gameid in this.games) {
          if(!this.games.hasOwnProperty(gameid)) continue;
          var game_instance = this.games[gameid];

          //Join the type of game the player is looking for
          if(game_instance.player_count < 2) {
            joined_a_game = true;
            game_instance.player_client = player;
            game_instance.gamecore.players.other.instance = player;
            game_instance.player_count++;
            this.startGame(game_instance);
          }
        }

        //Not sure this is how we want to deside how is making the game
        if(!joined_a_game) {

          this.createGame(player);

        }

      } else {

        //Not sure this is how we want to deside how is making the game
        this.createGame(player);
      }

    };
}
