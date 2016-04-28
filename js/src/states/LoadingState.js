import { BaseState } from './BaseState.js';

var TAG = 'LoadingState';
export class LoadingState extends BaseState{

    constructor(stateManager, size){

        super();
        
        this.name = 'loading_state';
        this.state_manager = this.stateManager;
        this.size = size;
    }

    setup(resources) {
        var loading_sprite = new PIXI.Sprite(resources.loading_asset.texture);

        loading_sprite.position.x = this.size.x/2;
        loading_sprite.position.y = this.size.y/2;

        loading_sprite.pivot.x = loading_sprite.width/2;
        loading_sprite.pivot.y = loading_sprite.height/2;

        loading_sprite.scale.x = 0.5;
        loading_sprite.scale.y = 0.5;

        loading_sprite.interactive = true;
        loading_sprite.on('mousedown', function(){
            console.log('gooooooooooooi');
        });

        this.container.addChild(loading_sprite);
    }

    render() {
        console.log(TAG, 'loopin');
    }

}
