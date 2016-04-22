import { BaseState } from './BaseState.js';

var TAG = 'MenuState';
export class MenuState extends BaseState {

    constructor(stage, size, fsm){
        super(stage, size, fsm);
        this.name = 'menu_state';
        var self = this;

        var play_button = new PIXI.Text("Play",{font : '24px Arial', fill : 0xff1010, align : 'center'})

        play_button.interactive = true;
        play_button.mousedown = function(mouseData){
            self.fsm.play();
        }

        play_button.position.x = size.x/2;
        play_button.position.y = size.y/2;
        play_button.pivot.x = play_button.width/2;
        play_button.pivot.y = play_button.height/2;

        this.container.addChild(play_button);

    }

    render() {
        console.log(TAG, 'loopin');
    }
}
