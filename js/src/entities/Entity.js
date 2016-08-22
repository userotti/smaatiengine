var Uuid = require('uuid');
export class Entity {

    constructor(_class){
        this.entity_type = _class;
        this.id = Uuid.v4();
        this.components = {};
    }

    addComponent (component) {
        component.entity = this;
        this.components[component.name] = component;
    }


    removeComponent (componentStringName) {
        delete this.components[componentStringName];
    }

    print (){
        console.log(this.id);
        console.log(this.components);
    }

}
