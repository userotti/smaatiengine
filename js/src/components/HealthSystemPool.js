require('../../../libs/gamecore.min.js');

var TAG = 'HealthSystemPool';

import { System } from './System.js'

export class HealthSystemPool extends System {

  constructor(eventEmitter) {

    super();
    this.event_emitter = eventEmitter;
    this.pool = gamecore.DualPooled('HealthSystemPool',
    {
      create: function (maxHealth)
      {
        var n = this._super();
        n.max_health = maxHealth;
        n.health = maxHealth;

        return n;
      }
    },
    {
      init: function ()
      {
        this.name = 'health';
      }
    });

  }

  update(currentComponent) {

    if (currentComponent.health <= 0){
      currentComponent.entity.components.sprite_remove.time_to_remove = true;
      this.event_emitter.emit('health-death', {
        entity: currentComponent.entity,
      });
    }

  }

}
