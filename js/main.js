// import local libs
import "script!../libs/gamecore.js";
import "script!../libs/pixi.js";
import "script!../libs/pixicam.min.js";
import "script!../libs/quadtree.js";

//your game init goes here

import { Game } from './src/game';

var TAG = 'Main.js'

//First app js to run
var game = new Game();

//A function to tell the rest of the HTML doc that the game has loaded.
game.loadAssets(function (loader, resources) {

    game.resources = resources;
    console.log(TAG, ' done loading game assets.');
    game.state_manager.fsm.loaded();

});
