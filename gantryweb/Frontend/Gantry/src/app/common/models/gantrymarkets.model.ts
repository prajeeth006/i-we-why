


export class Markets {
    sport?: string;
    markets: Array<Market>;

}

export class Market {
    name?: string;
    title?: string;
    matches?: Array<string>;
}

export const Sports = {
    FootBall: "FootBall",
    Cricket: "Cricket",
    CdsCricket: "CdsCricket",
    Nfl: "Nfl",
    Rugby: "Rugby",
    CdsRugby: "CdsRugby",
    Boxing: "Boxing",
    Tennis: "Tennis",
    Darts: "Darts",
    Snooker: "Snooker",
    CdsSnooker: "CdsSnooker",
    Formula1: "Formula1",
    CdsFormula1: "CdsFormula1",
    CdsBoxing: "CdsBoxing",
    CdsTennis: "CdsTennis",
    CdsDarts: "CdsDarts",
    CdsGolf: "CdsGolf"
}

export const Racing = {
    Greyhounds: "Greyhounds"
}
