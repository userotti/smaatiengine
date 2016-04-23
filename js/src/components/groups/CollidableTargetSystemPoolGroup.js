require('../../../../libs/gamecore.min.js');
require('../../../../libs/quadtree.js');
var uuid = require('uuid');

var TAG = 'CollidableTargetSystemPoolGroup';

export class CollidableTargetSystemPoolGroup {

    constructor(x,y,w,h) {

        this.quadtree = new QuadTree({x: x,y: y,width: w,height: h}, false, 4, 5);
        this.pool = gamecore.DualPooled('CollidableTargetSystemPoolGroup' + uuid.v4(),
        {
            create: function (sprite)
            {
                var n = this._super();
                n.sprite = sprite;
                n.x = sprite.x;
                n.y = sprite.x;
                n.width = sprite.width;
                n.height = sprite.height;

                n.sprite.my_component = n;
                return n;
            }
        },
        {
            init: function ()
            {
                this.name = 'collidable_target';
            }
        });
    }

    setXYWH (component){
        let bounds = component.sprite.getBounds();
        component.x = bounds.x;
        component.y = bounds.y;
        component.width = bounds.width;
        component.height = bounds.height;
    }

    updateAll() {

        this.quadtree.clear();

        this.pool_pointer = this.pool.getPool()
        if (this.pool_pointer){
            this.current_pool_node = this.pool_pointer.getUsedList().first;
            while (this.current_pool_node)
            {
                this.setXYWH(this.current_pool_node.object());
                this.quadtree.insert(this.current_pool_node.object());
                this.current_pool_node = this.current_pool_node.next();
            }
        }

    }



}
