require('../../../libs/gamecore.min.js');
var PIXI = require('../../../libs/pixi.min.js');

var TAG = 'SpriteSystemPool';

import { System } from './System.js'

export class SpriteSystemPool extends System {

    constructor(contianer) {

        super();
        this.pool = gamecore.DualPooled('SpriteSystemPool',
        {
            create: function (params)
            {
                var n = this._super();

                // console.log(TAG + ' create params', params);
                n.sprite.position.x = params.posx;
                n.sprite.position.y = params.posy;
                n.sprite.scale.x = params.scaleX;
                n.sprite.scale.y = params.scaleY;
                n.sprite.texture = params.texture;
                n.sprite.pivot.x = params.texture.width * params.pivotXScale;
                n.sprite.pivot.y = params.texture.height * params.pivotYScale;
                n.sprite.rotation = params.rotation;
                // n.sprite.anchor.x = pivotXScale;
                // n.sprite.anchor.y = pivotYScale;

                n.draw_box = false;

                contianer.addChild(n.sprite);
                contianer.addChild(n.bounds_rect);
                return n;
            }
        },
        {
            init: function ()
            {

                this.name = 'sprite';
                this.sprite = (new PIXI.Sprite());
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
