export enum ResultCode {
    Win = 'WIN',
    Place = 'PLACE',
    Lose = 'LOSE',
    Reserve = '(RES)',
}

export enum Category {
    categoryName = 'TRAP',
    categoryKey1 = 19,
    categoryKey2 = 21,
    DarkCategoryName = 'Trap',
}
export enum DarkCategory {
    categoryName = 'Trap',
    categoryKey1 = 19,
    categoryKey2 = 21,
}

export enum ResultCount {
    latestThree = 4,
    latestSix = 7,
    latestFour = 5,
    latestTwo = 3,
}

export enum EachWay {
    winOnly = 'WIN ONLY',
}

export class PageRefreshTime {
    static pageRefreshTime: number = 30000;
}
