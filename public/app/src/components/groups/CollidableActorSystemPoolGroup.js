require('../../../../../libs/gamecore.min.js');
require('../../../../../libs/quadtree.js');
var uuid = require('uuid');

var TAG = 'CollidableActorSystemPoolGroup';

import { System } from '../System';
import { boxhit } from '../../utility/Functions';

export class CollidableActorSystemPoolGroup extends System{

  constructor(targetsArray, eventEmitter, eventStringName) {

    super();
    this.quadtrees = targetsArray;
    this.event_emitter = eventEmitter;
    this.event_string_name = eventStringName;
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
      currentComponent.sprite.boundsPadding = 0;
      currentComponent.sprite.updateTransform();

      let coliding_with = this.quadtrees[i].retrieve(currentComponent.sprite.getBounds());
      for (let j = 0; j < coliding_with.length; j++){

        if (boxhit(coliding_with[j], currentComponent.sprite.getBounds())){
          this.hitting_these_guys.add(coliding_with[j].sprite.my_component);
        }

      }

      if (this.hitting_these_guys.length()){
        this.event_emitter.emit(this.event_string_name, {
          actor: currentComponent.entity,
          targets: this.hitting_these_guys
        });
      }

    }
  }
}
