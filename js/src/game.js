var Uuid = require('uuid');
var Events = require('events');
var StateMachine = require('javascript-state-machine');
var PIXI = require('../../libs/pixi.min.js');

import { LoadingState } from './states/LoadingState'
import { GameState } from './states/GameState'
import { MenuState } from './states/MenuState'

var TAG = 'Game';

export class Game {

    constructor(renderer, stage, resources){
        this.id = Uuid.v4();
        this.size = new PIXI.Point(800,600);
        this.renderer = new PIXI.WebGLRenderer(this.size.x, this.size.y);
        this.stage = new PIXI.Container();

        this.fsm = this.setupFiniteStateMachine();
        this.loading_state = new LoadingState(this.stage, this.size, this.fsm);
        this.menu_state = new MenuState(this.stage, this.size, this.fsm);
        this.game_state = new GameState(this.stage, this.size, this.fsm);

        this.loading_state.container.addChild(new PIXI.Text(this.loading_state.name,{font : '24px Arial', fill : 0xff1010, align : 'center'}));
        this.menu_state.container.addChild(new PIXI.Text(this.menu_state.name,{font : '24px Arial', fill : 0xff1010, align : 'center'}));
        this.game_state.container.addChild(new PIXI.Text(this.game_state.name,{font : '24px Arial', fill : 0xff1010, align : 'center'}));

        //moet hierie doen vir ES6 vibes vir een of ander rede
        this.gameLoop = this.gameLoop.bind(this);
        document.body.appendChild(this.renderer.view);
    }

    //Loading vibes
    loadAssets(callback) {
        var self = this;

        PIXI.loader.add('loading_asset', 'img/pica2.png');
        PIXI.loader.load(function (loader, resources) {

            self.fsm.start();
            self.current_state.setup(resources);

            self.gameLoop();

            //proper loading vibes.
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

        //Do the stuff the current state want to do
        this.current_state.render();

        // This is the main render call that makes pixi draw your container and its children.
        this.renderer.render(this.stage);
    }

    setupFiniteStateMachine() {
        var self = this;
        return StateMachine.create({
            events: [
                { name: 'start',  from: 'none',  to: 'loading' },
                { name: 'loaded',  from: 'loading',  to: 'menu' },
                { name: 'play', from: 'menu', to: 'game'    },
            ],
            callbacks: {
                onstart:  function(event, from, to, msg) {
                    //nothing to hide
                    self.current_state = self.loading_state;
                    self.loading_state.container.visible = true;
                },
                onloaded:  function(event, from, to, msg) {
                    self.current_state.container.visible = false;
                    self.current_state = self.menu_state;
                    self.current_state.container.visible = true;
                },
                onplay:  function(event, from, to, msg) {
                    self.current_state.container.visible = false;
                    self.current_state = self.game_state;
                    self.current_state.container.visible = true;
                    self.current_state.startLevel();
                },
            }
        });
    }

}
