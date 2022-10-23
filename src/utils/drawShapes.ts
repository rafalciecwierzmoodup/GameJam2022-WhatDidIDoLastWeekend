import { Graphics } from "pixi.js";

export const drawRoundedRectangle = (options: drawRoundedRectangleType) => {
    const roundedRectangle = new Graphics()
        .beginFill(options.fill)
        .drawRoundedRect(
            options.x,
            options.y,
            options.width,
            options.height,
            options.radius
        )
        .endFill();

    if (options.alpha) roundedRectangle.alpha = 0.7;

    return roundedRectangle;
}

export interface drawRoundedRectangleType {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    fill: number;
    alpha?: number;
}
