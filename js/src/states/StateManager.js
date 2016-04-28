var StateMachine = require('javascript-state-machine');
var Uuid = require('uuid');

import { LoadingState } from './LoadingState'
import { GameState } from './GameState'
import { MenuState } from './MenuState'

export class StateManager {

    constructor(stage, size){
        this.id = Uuid.v4();

        this.frames_to_skip = 0;
        this.frame_counter = 0;

        var self = this;
        this.fsm = StateMachine.create({
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

        this.loading_state = new LoadingState(this, size);
        stage.addChild(this.loading_state.container);

        this.menu_state = new MenuState(this, size);
        stage.addChild(this.menu_state.container);

        this.game_state = new GameState(this, size);
        stage.addChild(this.game_state.container);

        this.loading_state.container.addChild(new PIXI.Text(this.loading_state.name,{font : '24px Arial', fill : 0xff1010, align : 'center'}));
        this.menu_state.container.addChild(new PIXI.Text(this.menu_state.name,{font : '24px Arial', fill : 0xff1010, align : 'center'}));
        this.game_state.container.addChild(new PIXI.Text(this.game_state.name,{font : '24px Arial', fill : 0xff1010, align : 'center'}));


    }

    render () {

        if (this.frame_counter < this.frames_to_skip) {
            this.frame_counter++;
        } else {
            this.frame_counter = 0;
            this.current_state.render();
        }



    }

}
