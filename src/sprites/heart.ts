import * as PIXI from 'pixi.js';


export default class Heart extends PIXI.AnimatedSprite {
    heartPointer = 0;
    heartTextures: Array<PIXI.Texture>;

    constructor(texture: Array<PIXI.Texture>) {
        super(texture);

        this.heartTextures = texture;

        this.textures = [this.heartTextures[this.heartPointer]];
    }

    lostHeart() {
        if (this.heartPointer < 4) {
            this.heartPointer += 1;
            this.textures = [this.heartTextures[this.heartPointer]];
        }
    }

    gainHeart() {
        if (this.heartPointer > 0) {
            this.heartPointer -= 1;
            this.textures = [this.heartTextures[this.heartPointer]];
        }
    }

    resetState() {
        this.heartPointer = 0;
        this.textures = [this.heartTextures[this.heartPointer]];
    }
}