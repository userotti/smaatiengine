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
import { HealthSystemPool } from '../components/HealthSystemPool';

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

    //Timers
    this.game_runtime = 0;
    this.asteroid_timer = 0;
    this.asteroid_timer_limit = 1000;
    this.reload_timer = 0;
    this.reload_timer_limit = 110;

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
    this.healthSystemPool = new HealthSystemPool(this.event_emitter);

    //Things that can be hit by Actors
    this.asteroid_targets = new CollidableTargetSystemPoolGroup(0,0,this.size.x,this.size.y);

    //Things that hit what they given to hit(Arrows -> hit the picachoos)
    this.player_targets = new CollidableTargetSystemPoolGroup(0,0,this.size.x,this.size.y);

    //Things that can be hit by Actors
    this.asteroid_actors = new CollidableActorSystemPoolGroup([this.player_targets.quadtree], this.event_emitter, 'asteroid-hit-bullet');
    //Things that hit what they given to hit(Arrows -> hit the picachoos)
    this.bullets = new CollidableActorSystemPoolGroup([this.asteroid_targets.quadtree], this.event_emitter, 'bullet-hit-asteroid');

    this.event_emitter.on('bullet-hit-asteroid',(collision) => {

      console.log(TAG + 'collision',collision);
      collision.actor.components.sprite_remove.time_to_remove = true;
      self.soundmanager.sounds['hit'].play();
      this.createSharpnal(collision.actor.components.sprite.sprite.position.x, collision.actor.components.sprite.sprite.position.y);

      var node = collision.targets.first;
      while (node)
      {
          node.object().entity.components.health.health -= 0.25;
          node = node.next();
      }
    });

    this.event_emitter.on('health-death',(data) => {
      console.log('data.entity', data.entity);
      if (data.entity.entity_type == 'asteroid'){
        this.soundmanager.sounds['crash'].play();
        console.log('Yass!', data.entity);
        this.createAsteroidSharpnal(data.entity.components.sprite.sprite.position.x, data.entity.components.sprite.sprite.position.y);
      }
    });
    // add all the systems
    this.systems.push(this.spriteSystemPool);
    this.systems.push(this.velocitySystemPool);
    this.systems.push(this.gravitySystemPool);
    this.systems.push(this.spriteDirectionalRotationSystemPool);
    this.systems.push(this.spriteRemoveSystemPool);
    this.systems.push(this.queRemoveSystemPool);
    this.systems.push(this.healthSystemPool);
    this.systems.push(this.asteroid_targets);
    this.systems.push(this.asteroid_actors);
    this.systems.push(this.player_targets);
    this.systems.push(this.bullets);

    //
    this.shooting = false;
  }

  startLevel() {

    var self = this;
    this.container.hitArea = new PIXI.Rectangle(0, 0, this.size.x, this.size.y);
    this.container.interactive = true;
    this.container.buttonMode = true;

    let stars = this.entityPool.pool.create();
    stars.addComponent(this.spriteSystemPool.pool.create({
      posx: 0,
      posy: 0,
      scaleX: 1,
      scaleY: 1,
      pivotXScale: 0,
      pivotYScale: 0,
      texture: PIXI.loader.resources.stars.texture,
      rotation: 0
    }));

    this.container.on('mousedown', function(mouseData){
      self.shooting = true;
    })

    this.container.on('mouseup', function(mouseData){
      self.shooting = false;
    })

    this.container.mousemove = (mouseData)=>{
      this.mouse_data = mouseData;
    }

    this.container.mouseout = (mouseData)=>{
      self.shooting = false;
    }


    // console.log(TAG + 'this.container.mouse',  this.container.mouse)

    //this.camera is a thing now
    //this.camera.follow(picachoo1.components.sprite.sprite);

    // console.log('renderer.plugins.interaction.mouse: ', this.container.renderer.plugins.interaction.mouse);

  }

  //This happens 60 times a second when this state is the current game state.
  render(dt) {

    // console.log()

    this.game_runtime += dt;

    //Timed Asteroids
    this.asteroid_timer -= dt;
    this.reload_timer -= dt;

    if (this.asteroid_timer < 0){
      this.asteroid_timer = this.asteroid_timer_limit;
      this.createAsteroid();

    }

    if (this.shooting){
      if (this.reload_timer < 0){
        this.reload_timer = this.reload_timer_limit;
        self.soundmanager.sounds['laser'].play();
        this.createBullet({
          x: 0,
          y: this.size.y*0.2
        }, this.mouse_data.data.global);

        this.createBullet({
          x: this.size.x,
          y: this.size.y*0.8
        }, this.mouse_data.data.global);

        this.createBullet({
          x: 0,
          y: this.size.y*0.8
        }, this.mouse_data.data.global);
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

    this.world.update();

  }


  createAsteroid() {
    let asteroid = this.entityPool.pool.create('asteroid');
    asteroid.addComponent(this.spriteSystemPool.pool.create({
      posx: this.size.x * Math.random(),
      posy: -100,
      scaleX: 1,
      scaleY: 1,
      pivotXScale: 0.5,
      pivotYScale: 0.2,
      texture: PIXI.loader.resources.asteroid.texture,
      rotation: 0,

    }));
    asteroid.addComponent(this.velocitySystemPool.pool.create(0, Math.random()*5 + 2));
    asteroid.addComponent(this.spriteRemoveSystemPool.pool.create(false));
    asteroid.addComponent(this.queRemoveSystemPool.pool.create(210));
    asteroid.addComponent(this.healthSystemPool.pool.create(3));
    asteroid.addComponent(this.asteroid_targets.pool.create(asteroid.components.sprite.sprite));

  }

  createBullet(shooter, target) {

    let diff_y = target.y - shooter.y;
    let diff_x = target.x - shooter.x;



    var angle = Math.atan2(diff_y, diff_x);
    var power = 20;

    console.log(TAG + ' diff_y: ', diff_y);
    console.log(TAG + ' diff_x: ', diff_x);
    console.log(TAG + ' angle: ', angle);


    var velx = Math.cos(angle)*power;
    var vely = Math.sin(angle)*power;


    let bullet = this.entityPool.pool.create();
    bullet.addComponent(this.spriteSystemPool.pool.create({
      posx: shooter.x,
      posy: shooter.y,
      scaleX: 0.1,
      scaleY: 0.5,
      pivotXScale: 0.5,
      pivotYScale: 0.2,
      texture: PIXI.loader.resources.bullet.texture,
      rotation: 0,
    }))

    bullet.addComponent(this.velocitySystemPool.pool.create(velx,vely));
    // bullet.addComponent(self.gravitySystemPool.pool.create(0,0.1));
    bullet.addComponent(this.spriteDirectionalRotationSystemPool.pool.create());
    bullet.addComponent(this.spriteRemoveSystemPool.pool.create(false));
    bullet.addComponent(this.queRemoveSystemPool.pool.create(410));
    bullet.addComponent(this.bullets.pool.create(bullet.components.sprite.sprite))

  }

  createSharpnal(x,y) {

    for(let i = 0; i < 20; i++){
      let shrap = this.entityPool.pool.create();
      shrap.addComponent(this.spriteSystemPool.pool.create({
        posx: x,
        posy: y,
        scaleX: 0.1,
        scaleY: 0.1,
        pivotXScale: 0.5,
        pivotYScale: 0.2,
        texture: PIXI.loader.resources.bullet.texture,
        rotation: Math.random()*3.14,
      }))

      shrap.addComponent(this.velocitySystemPool.pool.create((Math.random()-Math.random())*10,(Math.random()-Math.random())*10));
      shrap.addComponent(this.spriteRemoveSystemPool.pool.create(false));
      shrap.addComponent(this.queRemoveSystemPool.pool.create((Math.random()*20) + 10));
    }
  }

  createAsteroidSharpnal(x,y) {

    for(let i = 0; i < 6; i++){
      let shrap = this.entityPool.pool.create();
      shrap.addComponent(this.spriteSystemPool.pool.create({
        posx: x,
        posy: y,
        scaleX: 0.3,
        scaleY: 0.3,
        pivotXScale: 0.5,
        pivotYScale: 0.2,
        texture: PIXI.loader.resources.asteroid.texture,
        rotation: Math.random()*3.14,
      }))

      shrap.addComponent(this.velocitySystemPool.pool.create((Math.random()-Math.random())*5,(Math.random()-Math.random())*5));
      shrap.addComponent(this.spriteRemoveSystemPool.pool.create(false));
      shrap.addComponent(this.queRemoveSystemPool.pool.create((Math.random()*20) + 10));
    }
  }


}
