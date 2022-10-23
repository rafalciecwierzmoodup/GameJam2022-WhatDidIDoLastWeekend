import * as PIXI from 'pixi.js';

const loadGameAssets = () => {
    const loader = PIXI.Loader.shared;

    loadHeroAssets(loader);
    loadBossAssets(loader);
    loadMapAssets(loader);
    loadDialogBox(loader);
    loadBulletsAssets(loader);
    loadHudAssets(loader);
    loadMusic(loader);

    const progressLabel = document.getElementById('progress');

    loader.onProgress.add((loader) => {
        if (progressLabel) {
            progressLabel.textContent = loader.progress.toFixed(2).toString();
        }
    }
    );

    return loader;
};


const loadHeroAssets = (loader: PIXI.Loader) => {
    loader.add('heroSheet', `images/hero/hero.json`);
}

const loadMapAssets = (loader: PIXI.Loader) => {
    loader.add('mapStart', 'images/maps/mapStart.png');
}

const loadBossAssets = (loader: PIXI.Loader) => {
    loader.add('bossIdle', `images/boss/bossIdle.json`);
    loader.add('bossWalk', `images/boss/bossWalk.json`);
    loader.add('bossHit', `images/boss/bossHit.json`);
}

const loadDialogBox = (loader: PIXI.Loader) => {
    loader.add('dialogBox', 'images/dialog/dialogBox.png');
}

const loadBulletsAssets = (loader: PIXI.Loader) => {
    loader.add('shuriken', 'images/items/shuriken.png');
    loader.add('bolt', 'images/items/bolt.png');
}

const loadHudAssets = (loader: PIXI.Loader) => {
    loader.add('heart', `images/hud/heart.json`);
}

const loadMusic = (loader: PIXI.Loader) => {
    loader.add('bgSound', 'music/1 - Adventure Begin.ogg');
    loader.add('fightOneSound', 'music/24 - Final Area.ogg');
    loader.add('hit', 'music/Hit.wav');
    loader.add('heroHit', 'music/Kill.wav');
    loader.add('gameOver', 'music/GameOver.wav');
    loader.add('gameWon', 'music/15 - Credit Theme.ogg');
}

export default loadGameAssets;