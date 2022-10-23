import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import { drawRoundedRectangle } from '../utils/drawShapes';

export default class BossHealthbar extends PIXI.Container {
    health = 10;
    bgBar: Graphics;
    healthBar: Graphics;

    constructor() {
        super();

        this.x = 370;
        this.y = 15;

        this.bgBar = drawRoundedRectangle({
            fill: 0x000000,
            height: 14,
            width: 114,
            radius: 20,
            x: 0,
            y: 0,
            alpha: 0.9
        })

        this.healthBar = drawRoundedRectangle({
            fill: 0xffffff,
            height: 10,
            width: 100,
            radius: 20,
            x: 0,
            y: 0,
            alpha: 0.9
        })
        this.healthBar.x = 2;
        this.healthBar.y = 2;
        this.healthBar.width = this.health * 11;
        this.healthBar.tint = 0x00ff00;

        this.addChild(this.bgBar);
        this.addChild(this.healthBar);
    }

    loseHealth() {
        if (this.health > 0) {
            this.health -= 1;
            this.healthBar.width = this.health * 11;
            if (this.health < 7 && this.health > 4) {
                this.healthBar.tint = 0xffa500;
            } else if (this.health < 4) {
                this.healthBar.tint = 0xff1100;
            }
        }
    }

    resetState() {
        this.health = 10;
        this.healthBar.width = this.health * 11;
        this.healthBar.tint = 0x00ff00;
    }

}