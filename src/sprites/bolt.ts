import * as PIXI from 'pixi.js';

export default class Bolt extends PIXI.Sprite {
    direction: directionType;
    speed: number;

    constructor(texture: PIXI.Texture, direction: directionType, x: number, y: number, speed: number) {
        super(texture);

        this.direction = direction;
        this.speed = speed;

        this.anchor.set(0.5, 0.5);

        this.x = x + 8;
        this.y = y + 8;
    }


    update() {
        this.rotation += 0.1;

        if (this.direction === 'up') {
            this.y -= this.speed;
        }
        if (this.direction === 'down') {
            this.y += this.speed;
        }
        if (this.direction === 'left') {
            this.x -= this.speed;
        }
        if (this.direction === 'right') {
            this.x += this.speed;
        }
    }
}

type directionType = 'up' | 'down' | 'left' | 'right';