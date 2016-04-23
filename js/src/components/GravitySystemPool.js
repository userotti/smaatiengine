require('../../../libs/gamecore.min.js');

var TAG = 'GravitySystemPool';

import { System } from './System.js'

export class GravitySystemPool extends System {

    constructor() {

        super();
        this.pool = gamecore.DualPooled('GravitySystemPool',
        {
            create: function (gx,gy)
            {
                var n = this._super();
                n.gx = gx;
                n.gy = gy;
                return n;
            }
        },
        {
            init: function (gx,gy)
            {
                this.name = 'gravity';
                this.gx = gx;
                this.gy = gy;
            }
        });

    }

    update(currentComponent) {
        currentComponent.entity.components.velocity.vx += currentComponent.gx;
        currentComponent.entity.components.velocity.vy += currentComponent.gy;
    }

}
