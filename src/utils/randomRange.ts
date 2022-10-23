export function getRandomTimeRange(min: number, max: number) {
    return (Math.random() * (max - min) + min) * 1000;
}