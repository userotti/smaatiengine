var PIXI = require('../libs/pixi.min.js');
import { Game } from './src/game';

var TAG = 'Main.js'
//First app js to run
var game = new Game();
game.loadAssets(function (loader, resources) {

    game.resources = resources;
    console.log(TAG, ' done loading game assets.');
    game.fsm.loaded();

});
