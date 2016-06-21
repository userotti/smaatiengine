var Uuid = require('uuid');

var TAG = 'system';

export class System {

    constructor(){

    }

    updateAll() {

        this.pool_pointer = this.pool.getPool()

        if (this.pool_pointer){
            this.current_pool_node = this.pool_pointer.getUsedList().first;
            while (this.current_pool_node)
            {
                this.update(this.current_pool_node.object());
                this.current_pool_node = this.current_pool_node.next();
            }
        }

    }
}
