var PIXI = require('../../../libs/pixi.min.js');
var PIXICAM = require('../../../libs/pixicam.min.js');

import { EntityPool } from '../entities/EntityPool';

import { SpriteSystemPool } from '../components/SpriteSystemPool';
import { VelocitySystemPool } from '../components/VelocitySystemPool';
import { GravitySystemPool } from '../components/GravitySystemPool';
import { SpriteDirectionalRotationSystemPool } from '../components/SpriteDirectionalRotationSystemPool';
import { SpriteRemoveSystemPool } from '../components/SpriteRemoveSystemPool';
import { QueRemoveSystemPool } from '../components/QueRemoveSystemPool';
import { HealthSystemPool } from '../components/HealthSystemPool';

import { CollidableTargetSystemPoolGroup } from '../components/groups/CollidableTargetSystemPoolGroup';
import { CollidableActorSystemPoolGroup } from '../components/groups/CollidableActorSystemPoolGroup';


var TAG = 'LevelBuilder';
export class LevelBuilder {

  constructor(world, event_emitter) {

    this.world = world;
    this.event_emitter = event_emitter;

    //The system that loop through their components
    this.systems = [];

    //Pool for the entities
    this.entityPool = new EntityPool();

    //Build the pooled component systems
    this.spriteSystemPool = new SpriteSystemPool(this.world);
    this.velocitySystemPool = new VelocitySystemPool();
    this.gravitySystemPool = new GravitySystemPool();
    this.spriteDirectionalRotationSystemPool = new SpriteDirectionalRotationSystemPool();
    this.spriteRemoveSystemPool = new SpriteRemoveSystemPool(this.world);
    this.queRemoveSystemPool = new QueRemoveSystemPool();
    this.healthSystemPool = new HealthSystemPool(this.event_emitter);

    //Things that can be hit by Actors
    this.asteroid_targets = new CollidableTargetSystemPoolGroup(0,0,this.world.screenWidth,this.world.screenHeight);

    //Things that hit what they given to hit(Arrows -> hit the picachoos)
    this.bullets = new CollidableActorSystemPoolGroup([this.asteroid_targets.quadtree], this.event_emitter, 'bullet-hit-asteroid');

    // add all the systems
    this.systems.push(this.spriteSystemPool);
    this.systems.push(this.velocitySystemPool);
    this.systems.push(this.gravitySystemPool);
    this.systems.push(this.spriteDirectionalRotationSystemPool);
    this.systems.push(this.spriteRemoveSystemPool);
    this.systems.push(this.queRemoveSystemPool);
    this.systems.push(this.healthSystemPool);
    this.systems.push(this.asteroid_targets);
    this.systems.push(this.bullets);

  }

  createStars(){

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

  }

  createAsteroid() {
    let asteroid = this.entityPool.pool.create('asteroid');
    asteroid.addComponent(this.spriteSystemPool.pool.create({
      posx: this.world.screenWidth * Math.random(),
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
