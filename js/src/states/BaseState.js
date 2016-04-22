var PIXI = require('../../../libs/pixi.min.js');

var TAG = 'BaseState';
export class BaseState {

    constructor(stage, size, fsm){
        this.container = new PIXI.Container();
        this.container.visible = false;
        stage.addChild(this.container);
        this.size = size;
        this.fsm = fsm;
    }

    render() {
        console.error(TAG, 'render() method: implement me!');
    }

}
