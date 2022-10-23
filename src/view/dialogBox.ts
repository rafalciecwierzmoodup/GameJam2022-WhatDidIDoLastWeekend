import * as PIXI from 'pixi.js';

export default class DialogBox extends PIXI.Sprite {
    dialogs: Array<string> = [];
    start: number = 0;
    end: number = 0;
    style: PIXI.TextStyle = new PIXI.TextStyle({
        breakWords: true,
        fontSize: 10,
        wordWrap: true,
        wordWrapWidth: 220
    });

    isFinished = false;

    title = new PIXI.Text('TeamDeckCyclop PEPE', { fontSize: 10, fill: 'white' })

    text = new PIXI.Text('', this.style);

    constructor(texture: PIXI.Texture, dialogs: Array<string>) {
        super(texture);

        this.visible = false;

        this.dialogs = dialogs;
        this.text.text = dialogs[0];
        this.end = dialogs.length;

        // Dialog position
        this.x = 100;
        this.y = 220;

        // Text position
        this.text.x = 60;
        this.text.y = 20;

        // Title position
        this.title.x = 5;

        this.addChild(this.text)
        this.addChild(this.title)

        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    showDialog() {
        this.visible = true;
        this.isFinished = false;
    }

    closeDialog() {
        this.visible = false;
        this.isFinished = true;
    }

    onKeyDown(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case " ":
                if (this.dialogs[this.start + 1]) {
                    this.start += 1;
                    this.text.text = this.dialogs[this.start];
                } else {
                    this.closeDialog();
                }
                break
        }
    }
}