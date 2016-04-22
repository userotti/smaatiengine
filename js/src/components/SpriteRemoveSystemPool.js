require('../../../libs/gamecore.min.js');

var TAG = 'VelocitySystemPool';

import { System } from './System.js'

export class SpriteRemoveSystemPool extends System {

    constructor(container) {

        super();
        this.container = container;
        this.utilityList = new gamecore.LinkedList();
        this.pool = gamecore.DualPooled('SpriteRemoveSystemPool',
        {
            create: function (timeToRemove)
            {
                var n = this._super();
                n.time_to_remove = timeToRemove;
                return n;
            }
        },
        {
            init: function (timeToRemove)
            {
                this.name = 'sprite_remove';
                this.time_to_remove = timeToRemove;
            }
        });

    }

    updateAll() {

        this.pool_pointer = this.pool.getPool()
        if (this.pool_pointer){

            this.current_pool_node = this.pool_pointer.getUsedList().first;

            while (this.current_pool_node)
            {
                var currentComponent = this.current_pool_node.object();
                if (currentComponent.time_to_remove){
                    //loop through the entitiy's components as their name
                    for (var component in currentComponent.entity.components){
                        //Remove the sprite from the container/scene,
                        if (currentComponent.entity.components[component].sprite){
                            this.container.removeChild(currentComponent.entity.components[component].sprite);
                        }
                        this.utilityList.add(currentComponent.entity.components[component]);
                        currentComponent.entity.removeComponent(component);
                    }
                }
                
                this.current_pool_node = this.current_pool_node.next();
            }

            var node = this.utilityList.first;
            while (node)
            {
                node.object().release();
                node = node.next();
            }

            this.utilityList.clear();

        }

    }

}
