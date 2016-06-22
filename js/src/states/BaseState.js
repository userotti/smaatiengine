var TAG = 'BaseState';
export class BaseState {

    constructor(){
        this.container = new PIXI.Container();
        this.container.visible = false;
    }

    render() {
        console.error(TAG, 'render() method: implement me!');
    }

}
