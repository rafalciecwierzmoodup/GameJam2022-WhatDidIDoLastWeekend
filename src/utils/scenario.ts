export const gameScenario: gameScenario = {
    animationOne: 'pre',
    animationTwo: 'pre',
    bossDialogOne: 'pre',
    fightOne: 'pre',
    fightTwo: 'pre',
    fightThree: 'pre',
    gameLost: 'pre',
    gameWon: 'pre',
}

export interface gameScenario {
    animationOne: eventState,
    animationTwo: eventState,
    bossDialogOne: eventState,
    fightOne: eventState,
    fightTwo: eventState,
    fightThree: eventState,
    gameLost: eventState,
    gameWon: eventState,
}

type eventState = 'pre' | 'on' | 'end';