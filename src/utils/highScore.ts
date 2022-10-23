export const getHighScore = () => {
    const highScore = localStorage.getItem('gameHighScore');

    return highScore ? parseFloat(highScore) : 0;
}

export const isHighScore = (score: number) => {
    const highScore = getHighScore();

    return score < highScore;
}

export const setHighScore = (score: number) => {
    if (isHighScore(score)) localStorage.setItem('gameHighScore', score.toString());
}

export const parseTime = (start: number, end: number) => {
    return parseFloat(((end - start) / 1000).toFixed(1));
}