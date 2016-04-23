require('../../../libs/gamecore.min.js');
var PIXI = require('../../../libs/pixi.min.js');

var TAG = 'SpriteSystemPool';

import { System } from './System.js'

export class SpriteSystemPool extends System {

    constructor(contianer) {

        super();
        this.pool = gamecore.DualPooled('SpriteSystemPool',
        {
            create: function (x,y,scaleX, scaleY, pivotXScale, pivotYScale, texture)
            {
                var n = this._super();
                n.sprite.position.x = x;
                n.sprite.position.y = y;
                n.sprite.scale.x = scaleX;
                n.sprite.scale.y = scaleY;
                n.sprite.texture = texture;
                n.sprite.pivot.x = texture.width * pivotXScale;
                n.sprite.pivot.y = texture.height * pivotYScale;
                contianer.addChild(n.sprite);
                return n;
            }
        },
        {
            init: function (x, y, scaleX, scaleY, texture)
            {
                this.name = 'sprite';
                this.sprite = (new PIXI.Sprite(texture));
                this.sprite.position.x = x;
                this.sprite.position.y = y;
                this.sprite.scale.x = scaleX;
                this.sprite.scale.y = scaleY;
            }
        });

    }

    update(currentComponent) {


    }


}
