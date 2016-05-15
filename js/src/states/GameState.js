var PIXI = require('../../../libs/pixi.min.js');
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

        this.systems = [];
        this.entityPool = new EntityPool();

        this.event_emitter = new EventEmitter();

        this.soundmanager = new SoundManager();

        this.event_emitter.on('actor_target_collision', function(collidingActorEntity){
            //console.log('collidingActorEntity');
            collidingActorEntity.components.sprite_remove.time_to_remove = true;
            self.soundmanager.sounds['smack'].play();

        })

        this.spriteSystemPool = new SpriteSystemPool(this.container);
        this.velocitySystemPool = new VelocitySystemPool();
        this.gravitySystemPool = new GravitySystemPool();
        this.spriteDirectionalRotationSystemPool = new SpriteDirectionalRotationSystemPool();
        this.spriteRemoveSystemPool = new SpriteRemoveSystemPool(this.container);
        this.queRemoveSystemPool = new QueRemoveSystemPool();

        this.picachoos = new CollidableTargetSystemPoolGroup(0,0,this.size.x,this.size.y);

        this.arrows = new CollidableActorSystemPoolGroup([this.picachoos.quadtree], function(actorEntity, targetEntities){
            actorEntity.components.sprite_remove.time_to_remove = true;
            self.soundmanager.sounds['smack'].play();
        });

        this.systems.push(this.spriteSystemPool);
        this.systems.push(this.velocitySystemPool);
        this.systems.push(this.gravitySystemPool);
        this.systems.push(this.spriteDirectionalRotationSystemPool);
        this.systems.push(this.spriteRemoveSystemPool);
        this.systems.push(this.queRemoveSystemPool);
        this.systems.push(this.picachoos);
        this.systems.push(this.arrows);

        this.shooting = false;
    }

    startLevel() {

        var self = this;
        this.container.hitArea = new PIXI.Rectangle(0, 0, this.size.x, this.size.y);
        this.container.interactive = true;
        this.container.on('mousedown', function(mouseData){

            self.shooting = true;
            let dude = self.entityPool.pool.create();
            dude.addComponent(self.spriteSystemPool.pool.create(self.size.x/2,self.size.y,1.5,1.5,0.5,0.2,PIXI.loader.resources.arrow.texture));
            dude.addComponent(self.velocitySystemPool.pool.create((0.5-Math.random())*5,-5*(Math.random()) - 12 ));
            dude.addComponent(self.gravitySystemPool.pool.create(0,0.1));
            dude.addComponent(self.spriteDirectionalRotationSystemPool.pool.create());
            dude.addComponent(self.spriteRemoveSystemPool.pool.create(false));
            dude.addComponent(self.queRemoveSystemPool.pool.create(410));
            dude.addComponent(self.arrows.pool.create(dude.components.sprite.sprite))


        })

        this.container.on('mouseup', function(mouseData){
            self.shooting = false;
        })

        var random1 = Math.random();
        var random2 = Math.random();

        var hitable = this.entityPool.pool.create();
        hitable.addComponent(this.spriteSystemPool.pool.create(this.size.x/2 - 300, 600,random1,random1,0.5,0.5,PIXI.loader.resources.loading_asset.texture))
        hitable.addComponent(this.picachoos.pool.create(hitable.components.sprite.sprite));


        var hitable = this.entityPool.pool.create();
        hitable.addComponent(this.spriteSystemPool.pool.create(this.size.x/2 + 300, 600,random2,random2,0.5,0.5,PIXI.loader.resources.loading_asset.texture))
        hitable.addComponent(this.picachoos.pool.create(hitable.components.sprite.sprite));




        //Pre populate the pools

        // for(let i = 0; i < 350; i++){
        //     let dude = this.entityPool.pool.create();
        //     dude.addComponent(this.spriteSystemPool.pool.create(this.size.x/2,this.size.y,0.7,0.7,PIXI.loader.resources.arrow.texture));
        //     dude.addComponent(this.velocitySystemPool.pool.create((0.5-Math.random())*5,-5*(Math.random()) - 7 ));
        //     dude.addComponent(this.gravitySystemPool.pool.create(0,0.1));
        //     dude.addComponent(this.spriteDirectionalRotationSystemPool.pool.create());
        //     dude.addComponent(this.spriteRemoveSystemPool.pool.create(true));
        //     dude.addComponent(this.queRemoveSystemPool.pool.create(0));
        //
        // }

    }

    //This happens 60 times a second when this state is the current game state.
    render() {

        if (this.shooting){

            for(let i = 0; i < 2; i++){
                let dude = this.entityPool.pool.create();
                dude.addComponent(this.spriteSystemPool.pool.create(this.size.x/2,this.size.y,0.7,0.7,0.5,0.2,PIXI.loader.resources.arrow.texture));
                dude.addComponent(this.velocitySystemPool.pool.create((0.5-Math.random())*4,-5*(Math.random()) - 7 ));
                dude.addComponent(this.gravitySystemPool.pool.create(0,0.1));
                dude.addComponent(this.spriteDirectionalRotationSystemPool.pool.create());
                dude.addComponent(this.spriteRemoveSystemPool.pool.create(false));
                dude.addComponent(this.queRemoveSystemPool.pool.create(210));
                dude.addComponent(this.arrows.pool.create(dude.components.sprite.sprite))

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
    }

}
