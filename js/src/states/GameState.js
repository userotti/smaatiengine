var PIXI = require('../../../libs/pixi.min.js');
var PIXICAM = require('../../../libs/pixicam.min.js');

const EventEmitter = require('events');

import { BaseState } from './BaseState';
import { EntityPool } from '../entities/EntityPool';
import { SoundManager } from '../SoundManager';

import { LevelBuilder } from '../utility/LevelBuilder';

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
    this.asteroid_timer_limit = 100;
    this.reload_timer = 0;
    this.reload_timer_limit = 30;

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

    this.world.screenWidth = this.size.x;
    this.world.screenHeight = this.size.y;


    //Pixi cam
    this.camera = this.world.camera;
    this.camera.viewCenterX = this.size.x/2;
    this.camera.viewCenterY = this.size.y/2;

    //Container is the pixi stage, and this dot world is the camera world
    this.container.addChild(this.world);

    // var filter = new PIXI.filters.PixelateFilter();
    // this.container.filters = [filter];

    console.log("this.world: " , this.world);
    this.levelBuilder = new LevelBuilder(this.world, this.event_emitter);


    //Bullet hit the asteroid events
    this.event_emitter.on('bullet-hit-asteroid',(collision) => {
      collision.actor.components.sprite_remove.time_to_remove = true;
      // self.soundmanager.sounds['hit'].play();
      this.levelBuilder.createSharpnal(collision.actor.components.sprite.sprite.position.x, collision.actor.components.sprite.sprite.position.y);
      var node = collision.targets.first;
      while (node)
      {
          node.object().entity.components.health.health -= 1.75;
          node = node.next();
      }
    });

    this.event_emitter.on('health-death',(data) => {
      if (data.entity.entity_type == 'asteroid'){
        this.soundmanager.sounds['crash'].play();
        this.levelBuilder.createAsteroidSharpnal(data.entity.components.sprite.sprite.position.x, data.entity.components.sprite.sprite.position.y);
      }
    });


    this.shooting = false;
  }

  startLevel() {

    var self = this;
    this.container.hitArea = new PIXI.Rectangle(0, 0, this.size.x, this.size.y);
    this.container.interactive = true;
    this.container.buttonMode = true;

    this.levelBuilder.createStars();

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
      this.levelBuilder.createAsteroid();
      console.log("make Asteroid");

    }

    if (this.shooting){
      if (this.reload_timer < 0){
        this.reload_timer = this.reload_timer_limit;
        self.soundmanager.sounds['laser'].play();
        // this.levelBuilder.createBullet({
        //   x: 0,
        //   y: this.size.y*0.2
        // }, this.mouse_data.data.global);
        //
        // this.levelBuilder.createBullet({
        //   x: this.size.x,
        //   y: this.size.y*0.8
        // }, this.mouse_data.data.global);

        this.levelBuilder.createBullet({
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
    for(let i = 0; i < this.levelBuilder.systems.length; i++){
      this.levelBuilder.systems[i].updateAll();
    }

    this.world.update();

  }





}
