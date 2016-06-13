var PIXI = require('../../../libs/pixi.min.js');
var PIXICAM = require('../../../libs/pixicam.min.js');

const EventEmitter = require('events');

import { BaseState } from './BaseState';
import { EntityPool } from '../entities/EntityPool';
import { SoundManager } from '../SoundManager';

import { SpriteSystemPool } from '../components/SpriteSystemPool';
import { VelocitySystemPool } from '../components/VelocitySystemPool';
import { GravitySystemPool } from '../components/GravitySystemPool';
import { SpriteDirectionalRotationSystemPool } from '../components/SpriteDirectionalRotationSystemPool';
import { SpriteRemoveSystemPool } from '../components/SpriteRemoveSystemPool';
import { QueRemoveSystemPool } from '../components/QueRemoveSystemPool';
import { CollidableTargetSystemPoolGroup } from '../components/groups/CollidableTargetSystemPoolGroup';
import { CollidableActorSystemPoolGroup } from '../components/groups/CollidableActorSystemPoolGroup';


var TAG = 'GameState';
export class GameState extends BaseState {

  constructor(stateManager, size){

    super();

    //this.container is defined in super() and gets added to the stage;
    self = this;
    this.name = 'game_state';
    this.state_manager = this.stateManager;
    this.size = size;

    //The system that loop through their components
    this.systems = [];

    //Pool for the entities
    this.entityPool = new EntityPool();

    this.event_emitter = new EventEmitter();
    this.soundmanager = new SoundManager();

    //Difines the camera world
    this.world = new pixicam.World({
      screenWidth: this.size.x,
      screenHeight: this.size.y,
      width: 5000,
      height: 5000,
      x: this.size.x/2,
      y: this.size.y/2
    });

    //Pixi cam
    this.camera = this.world.camera;
    this.camera.viewCenterX = this.size.x/2;
    this.camera.viewCenterY = this.size.y/2;
    this.container.addChild(this.world);

    //Build the pooled component systems
    this.spriteSystemPool = new SpriteSystemPool(this.world);
    this.velocitySystemPool = new VelocitySystemPool();
    this.gravitySystemPool = new GravitySystemPool();
    this.spriteDirectionalRotationSystemPool = new SpriteDirectionalRotationSystemPool();
    this.spriteRemoveSystemPool = new SpriteRemoveSystemPool(this.world);
    this.queRemoveSystemPool = new QueRemoveSystemPool();

    //Things that can be hit by Actors
    this.picachoos = new CollidableTargetSystemPoolGroup(0,0,this.size.x,this.size.y);

    //Things that hit what they given to hit(Arrows -> hit the picachoos)
    this.arrows = new CollidableActorSystemPoolGroup([this.picachoos.quadtree], this.event_emitter, 'arrow_hit_pica');

    this.event_emitter.on('arrow_hit_pica',(collision) => {
      collision.actor.components.sprite_remove.time_to_remove = true;
      self.soundmanager.sounds['smack'].play();
    });

    // add all the systems
    this.systems.push(this.spriteSystemPool);
    this.systems.push(this.velocitySystemPool);
    this.systems.push(this.gravitySystemPool);
    this.systems.push(this.spriteDirectionalRotationSystemPool);
    this.systems.push(this.spriteRemoveSystemPool);
    this.systems.push(this.queRemoveSystemPool);
    this.systems.push(this.picachoos);
    this.systems.push(this.arrows);

    //
    this.shooting = false;
  }

  startLevel() {

    var self = this;
    this.container.hitArea = new PIXI.Rectangle(0, 0, this.size.x, this.size.y);
    this.container.interactive = true;

    this.container.on('mousedown', function(mouseData){

      self.shooting = true;
      let arrow = self.entityPool.pool.create();
      arrow.addComponent(self.spriteSystemPool.pool.create(self.size.x/2,self.size.y,1.5,1.5,0.5,0.2,PIXI.loader.resources.arrow.texture));
      arrow.addComponent(self.velocitySystemPool.pool.create((0.5-Math.random())*5,-5*(Math.random()) - 12 ));
      arrow.addComponent(self.gravitySystemPool.pool.create(0,0.1));
      arrow.addComponent(self.spriteDirectionalRotationSystemPool.pool.create());
      arrow.addComponent(self.spriteRemoveSystemPool.pool.create(false));
      arrow.addComponent(self.queRemoveSystemPool.pool.create(410));
      arrow.addComponent(self.arrows.pool.create(arrow.components.sprite.sprite))

    })



    var random1 = Math.random();
    var random2 = Math.random();

    var picachoo1 = this.entityPool.pool.create();
    picachoo1.addComponent(this.spriteSystemPool.pool.create(this.size.x/2 - 300, 600,random1,random1,0.5,0.5,PIXI.loader.resources.loading_asset.texture))
    picachoo1.addComponent(this.picachoos.pool.create(picachoo1.components.sprite.sprite));
    picachoo1.addComponent(this.velocitySystemPool.pool.create(Math.random() - Math.random(), Math.random() - Math.random()));


    var picachoo2 = this.entityPool.pool.create();
    picachoo2.addComponent(this.spriteSystemPool.pool.create(this.size.x/2 + 300, 600,random2,random2,0.5,0.5,PIXI.loader.resources.loading_asset.texture))
    picachoo2.addComponent(this.picachoos.pool.create(picachoo2.components.sprite.sprite));


    this.container.on('mouseup', function(mouseData){
      self.shooting = false;
    })

    //this.camera is a thing now

    //this.camera.follow(picachoo1.components.sprite.sprite);



    //Pre populate the pools

    // for(let i = 0; i < 350; i++){
    //     let arrow = this.entityPool.pool.create();
    //     arrow.addComponent(this.spriteSystemPool.pool.create(this.size.x/2,this.size.y,0.7,0.7,PIXI.loader.resources.arrow.texture));
    //     arrow.addComponent(this.velocitySystemPool.pool.create((0.5-Math.random())*5,-5*(Math.random()) - 7 ));
    //     arrow.addComponent(this.gravitySystemPool.pool.create(0,0.1));
    //     arrow.addComponent(this.spriteDirectionalRotationSystemPool.pool.create());
    //     arrow.addComponent(this.spriteRemoveSystemPool.pool.create(true));
    //     arrow.addComponent(this.queRemoveSystemPool.pool.create(0));
    //
    // }

  }

  //This happens 60 times a second when this state is the current game state.
  render() {

    if (this.shooting){

      for(let i = 0; i < 2; i++){
        let arrow = this.entityPool.pool.create();
        arrow.addComponent(this.spriteSystemPool.pool.create(this.size.x/2,this.size.y,0.7,0.7,0.5,0.2,PIXI.loader.resources.arrow.texture));
        arrow.addComponent(this.velocitySystemPool.pool.create((0.5-Math.random())*4,-5*(Math.random()) - 7 ));
        arrow.addComponent(this.gravitySystemPool.pool.create(0,0.1));
        arrow.addComponent(this.spriteDirectionalRotationSystemPool.pool.create());
        arrow.addComponent(this.spriteRemoveSystemPool.pool.create(false));
        arrow.addComponent(this.queRemoveSystemPool.pool.create(210));
        arrow.addComponent(this.arrows.pool.create(arrow.components.sprite.sprite))

      }

      //Sprite Pool Performance test, leke

      // if (this.spriteSystemPool.pool.getPool()){
      //     console.log('Sprite Pool Size',  this.spriteSystemPool.pool.getPool().getFreeList().length() + this.spriteSystemPool.pool.getPool().getUsedList().length());
      // }
    }

    //Loop through and update all the systems of active pooled components.
    for(let i = 0; i < this.systems.length; i++){
      this.systems[i].updateAll();
    }

    //        this.camera.x += 1;

    this.world.update();

  }

}
