// require('../../../libs/gamecore.min.js');

var TAG = 'EntityPool';

import { Entity } from './Entity.js'

export class EntityPool {

    constructor() {

        this.pool = gamecore.DualPooled('EntityPool',
        {
            create: function ()
            {
                var n = this._super();
                return n;
            }
        },
        {
            init: function()
                {
                    this.entity = new Entity();
                    this.id = this.entity.id;
                    this.components = this.entity.components;
                    this.addComponent = this.entity.addComponent;
                    this.removeComponent = this.entity.removeComponent;
                    this.print = this.entity.print;

                }
        });
    }
}


// {
//     init: function()
//     {
//         this.entity = new Entity()
//         //console.log('this.entity', this.entity.addComponent);
//     }
// }

//
//
// EntityPool = gamecore.Pooled('Entity',  // derive from gamecore.Pooled
// {
//     // Static constructor
//     create:function ()   // super will handle allocation from a managed pool of objects
//     // the pool will autoexpand as required
//     {
//         var n = this._super();
//         return n;
//     }
// },
// new ECS.Entity()
// );
