import * as PIXI from 'pixi.js';
import { sound } from '@pixi/sound';

import loadGameAssets from './utils/loader';
import { gameScenario } from './utils/scenario';
import { getRandomTimeRange } from './utils/randomRange';
import { collisionDetection } from './utils/collision';
import { scriptsObject } from './utils/scripts';

import Hero from './sprites/hero';
import Menu from './view/menu';
import Map from './sprites/map';
import Boss from './sprites/boss';
import DialogBox from './view/dialogBox';
import Shuriken from './sprites/shuriken';
import Bolt from './sprites/bolt';
import Heart from './sprites/heart';
import BossHealthbar from './view/bossHealthbar';
import { getHighScore, isHighScore, parseTime, setHighScore } from './utils/highScore';

export default class Game {
    pixi: PIXI.Application;
    loader: PIXI.Loader;
    scenario: gameScenario = gameScenario;
    dialog?: DialogBox;
    menu?: Menu;
    map?: Map;
    hero?: Hero;
    boss?: Boss;
    heart?: Heart;
    bossHealthbar?: BossHealthbar;
    shurikens: Array<Shuriken> = [];
    bolts: Array<Bolt> = [];
    bossAttacks = {
        basicAttack: {
            isFired: false,
            min: 1,
            max: 3
        },
        secondaryAttack: {
            isFired: false,
            min: 1,
            max: 5
        },
        tertiaryAttack: {
            isFired: false,
            min: 1,
            max: 5
        },
        sneakyAttack: {
            isFired: false,
            min: 1,
            max: 1
        }
    }
    maxShurikens = 1;
    heroLives = 4;
    bossLives = 10;
    gameStart = 0;
    gameEnd = 0;
    highScore = 0;

    constructor(width: number, height: number) {
        this.pixi = new PIXI.Application({ width, height, antialias: true });
        document.body.appendChild(this.pixi.view);

        // GET HIGH SCORE FROM LOCAL STORAGE
        this.highScore = getHighScore();

        // INITIALIZE LOADER
        this.loader = loadGameAssets();
        this.loader.load(this.doneLoading.bind(this))
    }


    doneLoading(loader: any, resources: any) {
        // Delete loading information
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }

        this.map = new Map(resources.mapStart.texture);
        this.pixi.stage.addChild(this.map);

        // HERO INIT
        this.hero = new Hero(resources.heroSheet.spritesheet.animations.hero);
        this.hero.x = - 16 * 2;
        this.hero.y = this.pixi.view.height / 2;
        this.pixi.stage.addChild(this.hero);

        // BOSS INIT
        this.boss = new Boss({
            idle: resources.bossIdle.spritesheet.animations.bossIdle,
            walk: resources.bossWalk.spritesheet.animations.bossWalk,
            hit: resources.bossHit.spritesheet.animations.bossHit,
        })
        this.pixi.stage.addChild(this.boss);

        this.dialog = new DialogBox(resources.dialogBox.texture, scriptsObject.bossSceneTwo);
        this.pixi.stage.addChild(this.dialog);

        // MENU INIT
        this.menu = new Menu(this.pixi, {
            title: 'TimeSheet Ninja - Mood up edition',
            buttonText: 'Click to start the game'
        });

        // HEART INIT
        this.heart = new Heart(resources.heart.spritesheet.animations.heart);
        this.heart.visible = false;
        this.heart.x = 10;
        this.heart.y = 10;
        this.pixi.stage.addChild(this.heart);

        // BOSS HEALTHBAR
        this.bossHealthbar = new BossHealthbar();
        this.bossHealthbar.visible = false;
        this.pixi.stage.addChild(this.bossHealthbar);

        // EVENT ASSIGN
        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));

        // START THE TICK
        this.pixi.ticker.add((delta) => this.update(delta))

        sound.play('bgSound', {
            loop: true
        });
    }

    onKeyDown(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case " ":
                if (this.hero && this.loader.resources.shuriken.texture && (this.scenario.fightOne === 'on' || this.scenario.fightTwo === 'on' || this.scenario.fightThree === 'on')) {
                    if (this.shurikens.length < this.maxShurikens) {
                        const shuriken = new Shuriken(this.loader.resources.shuriken.texture, this.hero?.direction, this.hero?.x, this.hero.y)
                        this.pixi.stage.addChild(shuriken);
                        this.shurikens.push(shuriken);
                    }
                }
                break
        }
    };

    bossBasicAttack(speed: number) {
        if (!this.bossAttacks.basicAttack.isFired) {
            this.bossAttacks.basicAttack.isFired = true;

            if (this.boss && this.loader.resources.bolt.texture) {
                const bolt = new Bolt(this.loader.resources.bolt.texture, 'left', this.boss?.x, this.boss.y, speed)
                this.pixi.stage.addChild(bolt);
                this.bolts.push(bolt);
            }

            setTimeout(() => {
                this.bossAttacks.basicAttack.isFired = false;
            }, getRandomTimeRange(this.bossAttacks.basicAttack.min, this.bossAttacks.basicAttack.max))
        }
    };

    bossFromDownAttack(speed: number) {
        if (!this.bossAttacks.secondaryAttack.isFired) {
            this.bossAttacks.secondaryAttack.isFired = true;

            if (this.hero && this.loader.resources.bolt.texture) {
                const bolt = new Bolt(this.loader.resources.bolt.texture, 'up', this.hero?.x, 320, speed);
                this.pixi.stage.addChild(bolt);
                this.bolts.push(bolt);
            }

            setTimeout(() => {
                this.bossAttacks.secondaryAttack.isFired = false;
            }, getRandomTimeRange(this.bossAttacks.secondaryAttack.min, this.bossAttacks.secondaryAttack.max));
        }
    }

    bossFromRightAttack(speed: number) {
        if (!this.bossAttacks.tertiaryAttack.isFired) {
            this.bossAttacks.tertiaryAttack.isFired = true;

            if (this.hero && this.loader.resources.bolt.texture) {
                const bolt = new Bolt(this.loader.resources.bolt.texture, 'left', 520, this.hero.y, speed);
                this.pixi.stage.addChild(bolt);
                this.bolts.push(bolt);
            }

            setTimeout(() => {
                this.bossAttacks.tertiaryAttack.isFired = false;
            }, getRandomTimeRange(this.bossAttacks.tertiaryAttack.min, this.bossAttacks.tertiaryAttack.max));
        }
    }

    bossSneakyAttack() {
        if (!this.bossAttacks.sneakyAttack.isFired) {
            this.bossAttacks.sneakyAttack.isFired = true;

            if (this.hero && this.loader.resources.bolt.texture) {
                const bolt1 = new Bolt(this.loader.resources.bolt.texture, 'up', this.hero.x, 320, 7);
                const bolt2 = new Bolt(this.loader.resources.bolt.texture, 'up', this.hero.x + 16, 320, 7);
                const bolt3 = new Bolt(this.loader.resources.bolt.texture, 'up', this.hero.x + 32, 320, 7);
                const bolt4 = new Bolt(this.loader.resources.bolt.texture, 'up', this.hero.x + 48, 320, 7);
                const bolt5 = new Bolt(this.loader.resources.bolt.texture, 'up', this.hero.x + 64, 320, 7);
                this.pixi.stage.addChild(bolt1);
                this.pixi.stage.addChild(bolt2);
                this.pixi.stage.addChild(bolt3);
                this.pixi.stage.addChild(bolt4);
                this.pixi.stage.addChild(bolt5);
                this.bolts.push(bolt1);
                this.bolts.push(bolt2);
                this.bolts.push(bolt3);
                this.bolts.push(bolt4);
                this.bolts.push(bolt5);
            }

            setTimeout(() => {
                this.bossAttacks.sneakyAttack.isFired = false;
            }, getRandomTimeRange(this.bossAttacks.sneakyAttack.min, this.bossAttacks.sneakyAttack.max));
        }
    }

    cheekyCheck() {
        if (this.hero && this.hero.x > 250) {
            this.bossSneakyAttack();
        }
    }

    boltsCheck() {
        this.bolts.forEach((bolt, i) => {
            bolt.update();
            if (this.hero) {
                if (collisionDetection(bolt, this.hero)) {
                    this.pixi.stage.removeChild(this.bolts[i]);
                    this.bolts.splice(i, 1);
                    this.heroLives -= 1;
                    this.heart?.lostHeart();
                    sound.play('heroHit');
                }
            }

            if (bolt.x < 0 || bolt.y < 0) {
                this.pixi.stage.removeChild(this.bolts[i]);
                this.bolts.splice(i, 1);
            }
        })
    }

    shirukenCheck() {
        this.shurikens.forEach((shuriken, i) => {
            shuriken.update();
            if (this.boss && this.bossHealthbar) {
                if (collisionDetection(shuriken, this.boss)) {
                    sound.play('hit', {
                        loop: false
                    })
                    this.boss.getHit();
                    this.bossHealthbar.loseHealth();
                    this.bossLives -= 1;

                    this.pixi.stage.removeChild(this.shurikens[i]);
                    this.shurikens.splice(i, 1);
                }
            }

            if (shuriken.x < 0 || shuriken.x > 500 || shuriken.y < 0 || shuriken.y > 320) {
                this.pixi.stage.removeChild(this.shurikens[i]);
                this.shurikens.splice(i, 1);
            }

        })
    }

    update(delta: number) {
        if (this.menu && this.hero && this.heart) {
            if (this.menu.getWasClicked()) {
                this.menu.removeScene();
                if (this.gameStart === 0) {
                    this.gameStart = Date.now();
                }
                if (this.scenario.animationOne === 'pre') {
                    this.scenario.animationOne = 'on';
                }
                if (this.scenario.animationOne === 'on') {
                    this.sceneOne();
                }
                if (this.scenario.animationTwo === 'on') {
                    this.sceneTwo();
                }
                if (this.scenario.bossDialogOne === 'on') {
                    this.sceneThree();
                }
                if (this.scenario.fightOne === 'on') {
                    this.sceneFour();
                }
                if (this.scenario.fightTwo === 'on') {
                    this.sceneFive();
                }
                if (this.scenario.fightThree === 'on') {
                    this.sceneSix();
                }
                if (this.scenario.gameLost === 'on') {
                    this.gameLost();
                }
                if (this.scenario.gameWon === 'on') {
                    this.gameWon();
                }
            }
        }
    }


    sceneOne() {
        // Ninja is coming to the MoodUp Village
        if (this.hero && this.map && this.boss) {
            this.clearBullets();
            if (!this.hero.playing) {
                this.hero.textures = this.hero.heroTextures.right;
                this.hero.play();
            }

            this.hero.x += 1;
            this.boss.x -= 1;
            this.map.x -= 1;

            if (this.map.x < -138) {
                this.hero.textures = this.hero.heroTextures.right;
                this.scenario.animationOne = 'end';
                this.scenario.animationTwo = 'on';
            }
        }
    }

    sceneTwo() {
        // TeamDeckCyclop is greeting the ninja
        if (this.boss) {
            if (this.boss.state === 'idle') {
                this.boss.setState('walk');
            }
            this.boss.x -= 1;
            if (this.boss.x < 420) {
                this.boss.setState('idle');
                this.scenario.animationTwo = 'end';
                this.scenario.bossDialogOne = 'on';
            }
        }
    }

    sceneThree() {
        // Boss dialogue
        if (this.dialog && !this.dialog.visible && !this.dialog.isFinished) {
            this.dialog.showDialog();
        }

        if (this.dialog && this.dialog.isFinished && this.heart && this.bossHealthbar) {
            this.heart.visible = true;
            this.bossHealthbar.visible = true;
            this.scenario.bossDialogOne = 'end';
            this.scenario.fightOne = 'on';
            sound.stopAll();
            sound.play('fightOneSound', {
                loop: true
            });
        }
    }

    sceneFour() {
        // Fight part one
        if (this.hero) {
            this.hero.heroUpdate();
            this.boss?.fightOneUpdate();
            this.bossBasicAttack(3);
            this.cheekyCheck();
            this.shirukenCheck();
            this.boltsCheck();
            this.checkIfEnd();
        }
        if (this.bossLives < 7) {
            this.scenario.fightOne = 'end';
            this.scenario.fightTwo = 'on';
        }
    }

    sceneFive() {
        // Fight part two
        if (this.hero) {
            this.hero.heroUpdate();
            this.boss?.fightOneUpdate();
            this.shirukenCheck();
            this.bossBasicAttack(4);
            this.bossFromDownAttack(4);
            this.cheekyCheck();
            this.boltsCheck();
            this.checkIfEnd();
        }
        if (this.bossLives < 4) {
            this.scenario.fightTwo = 'end';
            this.scenario.fightThree = 'on';
        }
    }

    sceneSix() {
        // Fight part three
        if (this.hero) {
            this.hero.heroUpdate();
            this.boss?.fightOneUpdate();
            this.bossBasicAttack(5);
            this.bossFromDownAttack(5);
            this.bossFromRightAttack(5);
            this.cheekyCheck();
            this.shirukenCheck();
            this.boltsCheck();
            this.checkIfEnd();
        }
    }

    checkIfEnd() {
        if (this.heroLives <= 0) {
            this.scenario.fightOne = 'end';
            this.scenario.fightTwo = 'end';
            this.scenario.fightThree = 'end';
            this.scenario.gameLost = 'on';

            sound.stopAll();
            sound.play('gameOver');

            let msg = 'No high score to beat.';
            if (this.highScore !== 0) {
                msg = `High score: ${this.highScore} sec.`
            }

            this.menu = new Menu(this.pixi, {
                title: `You lost, but fear not! You can do better! \n${msg}`,
                buttonText: 'Click here to try again',
                titleFontSize: 16
            });
        }

        if (this.bossLives <= 0) {
            this.gameEnd = Date.now();

            const playTime = parseTime(this.gameStart, this.gameEnd);

            let highScoreMsg = '';

            if (isHighScore(playTime)) {
                setHighScore(playTime)
                this.highScore = playTime;
                highScoreMsg = `You have set a high score with ${playTime} sec!`
            }

            this.scenario.fightOne = 'end';
            this.scenario.fightTwo = 'end';
            this.scenario.fightThree = 'end';
            this.scenario.gameWon = 'on';

            sound.stopAll();
            sound.play('gameWon');

            this.menu = new Menu(this.pixi, {
                title: `Congratulations! Well done!\n${highScoreMsg}`,
                buttonText: 'Click here to try again',
                titleFontSize: 16
            });
        }
    }

    clearBullets() {
        this.bolts.forEach((bolt, i) => {
            this.pixi.stage.removeChild(this.bolts[i]);
            this.bolts.splice(i, 1);
        });
        this.shurikens.forEach((shuriken, i) => {
            this.pixi.stage.removeChild(this.shurikens[i]);
            this.shurikens.splice(i, 1);
        });
    }

    resetState() {
        if (this.hero && this.boss && this.map && this.heart && this.bossHealthbar) {
            this.clearBullets();
            this.hero.resetState();
            this.boss.resetState();
            this.bossHealthbar.resetState();
            this.map.x = 0;
            this.heroLives = 4;
            this.bossLives = 10;
            this.heart.resetState();
            this.gameStart = 0;
            this.gameEnd = 0;
            this.scenario.animationOne = 'on';
            this.scenario.animationTwo = 'pre';
            this.scenario.bossDialogOne = 'pre';
            this.scenario.fightOne = 'pre';
            this.scenario.fightTwo = 'pre';
            this.scenario.fightThree = 'pre';
            this.scenario.gameLost = 'pre';
            this.scenario.gameWon = 'pre';
        }
    }

    gameLost() {
        if (this.menu) {
            if (this.menu.getWasClicked()) {
                this.menu.removeScene();
                this.clearBullets();
                this.resetState();
                sound.stopAll();
                sound.play('bgSound');
            }
        }
    }

    gameWon() {
        if (this.menu) {
            if (this.menu.getWasClicked()) {
                this.menu.removeScene();
                this.resetState();
                this.clearBullets()
                sound.stopAll();
                sound.play('bgSound');
            }
        }
    }
}
