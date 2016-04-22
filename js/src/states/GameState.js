var PIXI = require('../../../libs/pixi.min.js');

import { BaseState } from './BaseState';
import { EntityPool } from '../entities/EntityPool';
import { SpriteSystemPool } from '../components/SpriteSystemPool';
import { VelocitySystemPool } from '../components/VelocitySystemPool';
import { GravitySystemPool } from '../components/GravitySystemPool';
import { SpriteDirectionalRotationSystemPool } from '../components/SpriteDirectionalRotationSystemPool';
import { SpriteRemoveSystemPool } from '../components/SpriteRemoveSystemPool';
import { QueRemoveSystemPool } from '../components/QueRemoveSystemPool';


var TAG = 'GameState';
export class GameState extends BaseState{

    constructor(stage, size, fsm){

        super(stage, size, fsm);
        //this.container is defined in super() and gets added to the stage;

        this.name = 'game_state';
        this.systems = [];
        this.entityPool = new EntityPool();

        this.spriteSystemPool = new SpriteSystemPool(this.container);
        this.velocitySystemPool = new VelocitySystemPool();
        this.gravitySystemPool = new GravitySystemPool();
        this.spriteDirectionalRotationSystemPool = new SpriteDirectionalRotationSystemPool();
        this.spriteRemoveSystemPool = new SpriteRemoveSystemPool(this.container);
        this.queRemoveSystemPool = new QueRemoveSystemPool();

        this.systems.push(this.spriteSystemPool);
        this.systems.push(this.velocitySystemPool);
        this.systems.push(this.gravitySystemPool);
        this.systems.push(this.spriteDirectionalRotationSystemPool);
        this.systems.push(this.spriteRemoveSystemPool);
        this.systems.push(this.queRemoveSystemPool);

        this.shooting = false;
    }

    startLevel() {

        var self = this;
        this.container.hitArea = new PIXI.Rectangle(0, 0, this.size.x, this.size.y);
        this.container.interactive = true;
        this.container.on('mousedown', function(mouseData){
            self.shooting = true;
            self.makeBlock(mouseData);

        })

        this.container.on('mouseup', function(mouseData){
            self.shooting = false;

        })

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

    render() {

        if (this.shooting){

            for(let i = 0; i < 5; i++){
                let dude = this.entityPool.pool.create();
                dude.addComponent(this.spriteSystemPool.pool.create(this.size.x/2,this.size.y,0.7,0.7,PIXI.loader.resources.arrow.texture));
                dude.addComponent(this.velocitySystemPool.pool.create((0.5-Math.random())*5,-5*(Math.random()) - 7 ));
                dude.addComponent(this.gravitySystemPool.pool.create(0,0.1));
                dude.addComponent(this.spriteDirectionalRotationSystemPool.pool.create());
                dude.addComponent(this.spriteRemoveSystemPool.pool.create(false));
                dude.addComponent(this.queRemoveSystemPool.pool.create(210));

            }

            if (this.spriteSystemPool.pool.getPool()){
        //        console.log('Sprite Pool Size',  this.spriteSystemPool.pool.getPool().getFreeList().length() + this.spriteSystemPool.pool.getPool().getUsedList().length());
            }
        }

        for(let i = 0; i < this.systems.length; i++){
            this.systems[i].updateAll();
        }
    }

    makeBlock(_mouseData){


    }

}
