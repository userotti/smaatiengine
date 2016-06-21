require('howler');
var q = require('q');

/*
* Setting up block level variable to store class state
* , set's to null by default.
*/
let instance = null;



var TAG = 'SoundManager'

export class SoundManager{
    constructor() {
        if(!instance){
            instance = this;
        }

        // to test whether we have singleton or not
        this.time = new Date()
        this.total_sounds = 0;
        this.sounds = [];
        this.loading_promises = [];
        return instance;
    }

    addSound(name, sound) {

        var defered = q.defer();
        sound.onload = function() {
            defered.resolve(name);
        }
        this.loading_promises.push(defered);
        this.sounds[name] = new Howl(sound);

    }

    doneLoading(callback) {
        return q.all(this.loading_promises).then(callback);
    }



}
