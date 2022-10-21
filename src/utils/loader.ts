import * as PIXI from 'pixi.js';

const loadGameAssets = () => {
    const loader = PIXI.Loader.shared;

    loadHeroAssets(loader)

    // loadMapAssets(loader);
    // loaderGuiAssets(loader);
    // loadKnightAssets(loader);
    // loadFoodAssets(loader);
    // loadPigeonAssets(loader);
    loadMusic(loader);

    const progressLabel = document.getElementById('progress');
    const progressContainer = document.getElementById('progressContainer');

    loader.onProgress.add((loader) => {
        if (progressLabel) {
            progressLabel.textContent = loader.progress.toString();
        }
        if (loader.progress === 100) {
            if (progressContainer) {
                progressContainer.style.display = 'none'
            }
        }
        console.log(loader.progress)
    }
    );

    return loader;
};


const loadHeroAssets = (loader: PIXI.Loader) => {
    loader.add('heroSheet', `images/hero/hero.json`);

    console.log(loader.resources);

}

// const loadPigeonAssets = (loader: PIXI.Loader) => {
//     for (let i = 0; i < 4; i++) {
//         loader.add(`pigeon${i}`, `images/pigeon/pigeon${i}.png`);
//     };
// }

// const loadMapAssets = (loader: PIXI.Loader) => {
//     loader.add('map', 'images/maps/map.png');
// }

// const loadFoodAssets = (loader: PIXI.Loader) => {
//     loader.add('pretzel', 'images/food/pretzel.png');
//     loader.add('peach', 'images/food/peach.png');
// }

// const loaderGuiAssets = (loader: PIXI.Loader) => {
//     loader.add('heart0', 'images/gui/heart0.png');
//     loader.add('heart1', 'images/gui/heart1.png');
// }

const loadMusic = (loader: PIXI.Loader) => {
    loader.add('bgSound', 'music/1 - Adventure Begin.ogg');
}

export default loadGameAssets;