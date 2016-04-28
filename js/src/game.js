var Uuid = require('uuid');
var PIXI = require('../../libs/pixi.min.js');


import { StateManager } from './states/StateManager'


var TAG = 'Game';

export class Game {

    constructor(renderer, stage, resources){
        this.id = Uuid.v4();
        this.size = new PIXI.Point(1200,800);

        //Build the webgl canvas element
        this.renderer = new PIXI.WebGLRenderer(this.size.x, this.size.y);
        document.body.appendChild(this.renderer.view);

        //MAIN PIXI sprite container
        this.stage = new PIXI.Container();

        //loading, menu, game
        this.state_manager = new StateManager(this.stage, this.size);

        //moet hierie doen vir ES6 vibes vir een of ander rede
        this.gameLoop = this.gameLoop.bind(this);

    }

    //Loading vibes
    loadAssets(callback) {
        var self = this;

        //Loading the assest for the Loading screen only
        PIXI.loader.add('loading_asset', 'img/pica2.png');
        PIXI.loader.load(function (loader, resources) {

            self.state_manager.fsm.start();
            self.state_manager.current_state.setup(resources);

            self.gameLoop();

            //proper loading vibes for the rest of the app
            loader.add('rocket', 'img/rocket.png');
            loader.add('rand', 'img/rand.png');
            loader.add('arrow', 'img/arrow_smaller.png');

            loader.load(callback);

        });
    }

    //Gameloop vibes
    gameLoop() {

        // Start the timer for the next animation loop
        requestAnimationFrame(this.gameLoop);

        // Do the stuff the current state want to do
        this.state_manager.render();

        // This is the main render call that makes pixi draw your container and its children.
        this.renderer.render(this.stage);
    }

}
