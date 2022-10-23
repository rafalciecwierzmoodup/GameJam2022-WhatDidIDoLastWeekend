import * as PIXI from 'pixi.js';

export default class Boss extends PIXI.AnimatedSprite {
    bossTextures: texturesObject = {
        idle: [],
        walk: [],
        hit: []
    };

    direction: 'up' | 'down' = 'up';
    state: state = 'idle';

    constructor(texturesObject: texturesObject) {
        super(texturesObject.idle);

        this.bossTextures = texturesObject;

        this.animationSpeed = 0.1;
        this.x = 590;
        this.y = 130;
        this.play();
    }

    setState(state: state) {
        this.state = state;
        this.textures = this.bossTextures[state];
        this.play();
    }

    resetState() {
        this.x = 590;
        this.y = 130;
        this.textures = this.bossTextures['idle'];
    }

    getHit() {
        this.textures = this.bossTextures.hit;
        this.loop = false;
        this.play();

        setTimeout(() => {
            this.textures = this.bossTextures.walk;
            this.loop = true;
            this.play();
        }, 500);
    }

    fightOneUpdate() {
        if (this.direction === 'up') {
            this.y -= 1;

            if (this.y < 50) {
                this.direction = 'down'
            }
        } else {
            this.y += 1;

            if (this.y > 200) {
                this.direction = 'up'
            }
        }

    }
}

type state = 'idle' | 'walk' | 'hit';

interface texturesObject {
    idle: Array<PIXI.Texture>;
    hit: Array<PIXI.Texture>;
    walk: Array<PIXI.Texture>;
}