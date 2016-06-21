require('../../../../libs/gamecore.min.js');

var TAG = 'QueRemoveSystemPool';

import { System } from './System.js'

export class QueRemoveSystemPool extends System {

    constructor() {

        super();
        this.pool = gamecore.DualPooled('QueRemoveSystemPool',
        {
            create: function (maxAge)
            {
                var n = this._super();
                n.max_age = maxAge
                return n;
            }
        },
        {
            init: function (maxAge)
            {
                this.name = 'que_remove';
                this.max_age = maxAge;
            }
        });

    }

    update(currentComponent) {

        if (currentComponent.max_age > 0){
            currentComponent.max_age -= 1;
        } else {
            currentComponent.entity.components.sprite_remove.time_to_remove = true;
        }

    }

}
