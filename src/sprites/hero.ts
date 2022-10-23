import * as PIXI from 'pixi.js';

export default class Hero extends PIXI.AnimatedSprite {
    heroTextures: heroTextures = {
        down: [],
        up: [],
        left: [],
        right: [],
    };

    speed: number = 3;
    isIdle: boolean = false;
    direction: 'up' | 'left' | 'right' | 'down' = 'right';

    constructor(texture: Array<PIXI.Texture>) {
        super(texture);

        // Assing textures
        this.parseTextures(texture);

        this.animationSpeed = 0.1;

        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e));;
    }

    heroUpdate() {
        if (!this.isIdle) {
            if (this.direction === 'left' && this.x > 0) {
                this.x -= this.speed;
            } else if (this.direction === 'right' && this.x < 500 - this.width) {
                this.x += this.speed;
            } else if (this.direction === 'up' && this.y > 16 * 3) {
                this.y -= this.speed;
            } else if (this.direction === 'down' && this.y < 320 - this.width - 3 * 16) {
                this.y += this.speed;
            }
        }
    }

    resetState() {
        this.x = - 16 * 2;
        this.y = 150;
        this.direction = 'right';
        this.isIdle = true;
        this.textures = this.heroTextures.right;
    }

    onKeyDown(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
                if (this.isIdle) {
                    this.isIdle = false;
                    this.direction = 'left';
                    this.textures = this.heroTextures.left;
                    this.play();
                }
                break
            case "D":
            case "ARROWRIGHT":
                if (this.isIdle) {
                    this.isIdle = false;
                    this.direction = 'right';
                    this.textures = this.heroTextures.right;
                    this.play();
                }
                break
            case "W":
            case "ARROWUP":
                if (this.isIdle) {
                    this.isIdle = false;
                    this.direction = 'up';
                    this.textures = this.heroTextures.up;
                    this.play();
                }
                break
            case "s":
            case "ARROWDOWN":
                if (this.isIdle) {
                    this.isIdle = false;
                    this.direction = 'down';
                    this.textures = this.heroTextures.down;
                    this.play();
                }
                break
        }
    }

    onKeyUp(e: KeyboardEvent): void {
        this.isIdle = true;
        this.textures = [this.heroTextures[this.direction][0]];
    }

    parseTextures(textures: Array<PIXI.Texture>) {
        this.heroTextures.down = textures.slice(0, 5);
        this.heroTextures.up = textures.slice(6, 11);
        this.heroTextures.left = textures.slice(12, 17);
        this.heroTextures.right = textures.slice(18, 23);
        this.textures = [this.heroTextures.down[0]];
    }
};

interface heroTextures {
    left: Array<PIXI.Texture>;
    right: Array<PIXI.Texture>;
    up: Array<PIXI.Texture>;
    down: Array<PIXI.Texture>;
}