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
                // n.sprite.anchor.x = pivotXScale;
                // n.sprite.anchor.y = pivotYScale;

                n.draw_box = false;

                contianer.addChild(n.sprite);
                contianer.addChild(n.bounds_rect);
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

                this.bounds_rect = new PIXI.Graphics();


            }
        });

    }

    update(currentComponent) {

        if (currentComponent.draw_box){
            currentComponent.bounds_rect.clear();
            currentComponent.bounds_rect.lineStyle(2, 0xaaffcc, 1);
            let bounds = currentComponent.sprite.getBounds();
            currentComponent.bounds_rect.drawRect(
                bounds.x, bounds.y,
                bounds.width,
                bounds.height
            );
        }


    }


}
