// require('../../../libs/gamecore.min.js');

var TAG = 'VelocitySystemPool';

import { System } from './System.js'

export class SpriteDirectionalRotationSystemPool extends System {

    constructor() {

        super();
        this.pool = gamecore.DualPooled('SpriteDirectionalRotationSystemPool',
        {
            create: function ()
            {
                var n = this._super();
                return n;
            }
        },
        {
            init: function ()
            {
                this.name = 'sprite_directional_rotation';
            }
        });

    }

    update(currentComponent) {
        currentComponent.entity.components.sprite.sprite.rotation = Math.atan2(currentComponent.entity.components.velocity.vy,currentComponent.entity.components.velocity.vx) + Math.PI/2;
        //console.log('rotation?', currentComponent.entity.components.sprite.rotation)
    }

}
