import * as PIXI from 'pixi.js';
import Hero from './sprites/hero';
import { sound } from '@pixi/sound';
import loadGameAssets from './utils/loader';

export default class Game {
    pixi: PIXI.Application;
    loader: PIXI.Loader;
    hero?: Hero;

    constructor(width: number, height: number) {
        this.pixi = new PIXI.Application({ width, height, antialias: true });
        document.body.appendChild(this.pixi.view);

        // INITIALIZE LOADER
        this.loader = loadGameAssets();
        this.loader.load(this.doneLoading.bind(this))

        // GET HIGH SCORE FROM LOCAL STORAGE
        // this.highScore = getHighScore();
    }


    doneLoading(loader: any, resources: any) {
        console.log('DOne loading');

        console.log(resources);

        this.hero = new Hero(resources.heroSheet.spritesheet.animations.hero);

        this.hero.x = this.pixi.view.width / 2;
        this.hero.y = this.pixi.view.height / 2;
        this.pixi.stage.addChild(this.hero);



        // START THE TICK
        this.pixi.ticker.add((delta) => this.update())

        sound.play('bgSound');
    }

    update() {
        this.hero?.heroUpdate();
    }

}
