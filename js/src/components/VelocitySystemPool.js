require('../../../libs/gamecore.js');

var TAG = 'VelocitySystemPool';

import { System } from './System.js'

export class VelocitySystemPool extends System {

    constructor() {

        super();
        this.pool = gamecore.DualPooled('VelocitySystemPool',
        {
            create: function (vx,vy)
            {
                var n = this._super();
                n.vx = vx;
                n.vy = vy;
                return n;
            }
        },
        {
            init: function (vx,vy)
            {
                this.name = 'velocity';
                this.vx = vx;
                this.vy = vy;
            }
        });

    }

    update(currentComponent) {
        currentComponent.entity.components.sprite.sprite.position.x += currentComponent.vx;
        currentComponent.entity.components.sprite.sprite.position.y += currentComponent.vy;
    }

}
