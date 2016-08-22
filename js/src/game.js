var Uuid = require('uuid');
var PIXI = require('../../libs/pixi.min.js');
var q = require('q');

import { SoundManager } from './SoundManager'
import { StateManager } from './states/StateManager'


var TAG = 'Game';

export class Game {

  constructor(renderer, stage, resources){
    //
    // let cache = new SoundManager()
    // console.log('1-->',cache.time);
    //
    // setTimeout(function(){
    //     let cache = new SoundManager();
    //     console.log('2-->',cache.time);
    // },4000);

    this.id = Uuid.v4();
    this.delta = 0;
    this.last_time = 0;
    this.now = 0;

    this.size = new PIXI.Point(640,960);

    //Build the webgl canvas element
    this.renderer = new PIXI.WebGLRenderer(this.size.x, this.size.y);
    document.body.appendChild(this.renderer.view);

    //MAIN PIXI sprite container
    this.stage = new PIXI.Container();
    this.stage.width = this.size.x;
    this.stage.height = this.size.y;
    this.stage.yoh = 100;


    //loading, menu, game
    this.state_manager = new StateManager(this.stage, this.size);

    //moet hierie doen vir ES6 vibes vir een of ander rede
    this.loop = this.loop.bind(this);

  }

  //Loading vibes
  loadAssets(callback) {
    var self = this;
    let loading_promises = [];


    var images_defered = q.defer();
    var sounds_defered = q.defer();
    loading_promises.push(images_defered.promise);
    loading_promises.push(sounds_defered.promise);


    //Loading the assest for the Loading screen only
    PIXI.loader.add('loading_asset', 'img/pica2.png');
    PIXI.loader.load(function (loader, resources) {

      self.state_manager.fsm.start();
      self.state_manager.current_state.setup(resources);


      //proper loading vibes for the rest of the app
      //Image Loading
      loader.add('rocket', 'img/rocket.png');
      loader.add('rand', 'img/rand.png');
      loader.add('arrow', 'img/arrow_smaller.png');

      loader.add('bullet', 'img/characters/geel.png');
      loader.add('ship', 'img/characters/blougrys.png');
      loader.add('asteroid', 'img/characters/asteroid.png');
      loader.add('stars', 'img/backgrounds/stars.png');



      let soundmanager = new SoundManager()
      let un_loaded_howls = [];


      //Sound Loadeing
      soundmanager.addSound('smack', {
        urls: ['audio/smack.mp3', 'audio/smack.ogg'],
        autoplay: false,
        loop: false,
        volume: 0.5,
      });

      soundmanager.addSound('laser', {
        urls: ['audio/sfx2.wav'],
        autoplay: false,
        loop: false,
        volume: 0.3,
      });

      soundmanager.addSound('hit', {
        urls: ['audio/hit.wav'],
        autoplay: false,
        loop: false,
        volume: 0.5,
      });

      soundmanager.addSound('crash', {
        urls: ['audio/crash.wav'],
        autoplay: false,
        loop: false,
        volume: 0.5,
      });


      loader.load(function(){
        console.log('done with images_defered');
        images_defered.resolve();
      });

      soundmanager.doneLoading(function(){
        console.log('done with sounds_defered');
        sounds_defered.resolve();
      })

      //kick off
      self.loop();

    });

    console.log('loading_promises', loading_promises);
    q.all(loading_promises).then(function(){
      console.log('done with all the loading');
      callback();
    })

  }

  //loop vibes
  loop() {


    this.now = Date.now();
    this.delta = (this.now - this.last_time);
    this.last_time = this.now;

    // Start the timer for the next animation loop
    requestAnimationFrame(this.loop);

    // Do the stuff the current state want to do
    this.state_manager.render(this.delta);

    // This is the main render call that makes pixi draw your container and its children.
    this.renderer.render(this.stage);


  }

}
