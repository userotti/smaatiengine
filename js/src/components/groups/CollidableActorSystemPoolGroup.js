require('../../../../libs/gamecore.min.js');
require('../../../../libs/quadtree.js');
var uuid = require('uuid');

var TAG = 'CollidableActorSystemPoolGroup';

import { System } from '../System';
import { boxhit } from '../../utility/Functions';

export class CollidableActorSystemPoolGroup extends System{

    constructor(targetsArray) {

        super();
        this.quadtrees = targetsArray;
        this.hitting_these_guys = new gamecore.LinkedList();
        this.pool = gamecore.DualPooled('CollidableActorSystemPoolGroup' + uuid.v4(),
        {
            create: function (sprite)
            {
                var n = this._super();
                n.sprite = sprite;
                return n;
            }
        },
        {
            init: function ()
            {
                this.name = 'collidable_actor';
            }
        });
    }

    update(currentComponent) {

        this.hitting_these_guys.clear();

        for (let i = 0; i < this.quadtrees.length; i++){

            let coliding_with = this.quadtrees[i].retrieve(currentComponent.sprite.getBounds());
            for (let j = 0; j < coliding_with.length; j++){

                if (boxhit(coliding_with[j], currentComponent.sprite)){
                    this.hitting_these_guys.add(coliding_with[j].sprite.my_component);
                    // console.log('coliding_with! x:', coliding_with[j].x + ' y:' + coliding_with[j].y + ' width:' + coliding_with[j].width + ' height:' + coliding_with[j].height);
                    // console.log('currentComponent.sprite! x:', currentComponent.sprite.x + ' y:' + currentComponent.sprite.y + ' width:' + currentComponent.sprite.width + ' height:' + currentComponent.sprite.height);
                    
                }

            }

        }
    }
}
