import { Formula1DataContent } from "./formula1-content.model";

export class Formula1TemplateContent {
    leadTitle: string;
    eventName: string;
    eventDateTime?: Date;
    eventType: string;
    racerList: Array<Racers> = [];
    racerBetNameList: Array<RacerBetName> = [];
    winOrEachWayTextList: Array<EachWayText> = [];
    formula1DataContent?: Formula1DataContent;
    raceWinner: Array<MarketSelection> = [];
    fastestLap: Array<MarketSelection> = [];
    podiumFinish: Array<MarketSelection> = [];
    pointsFinish: Array<MarketSelection> = [];
}

export class Racers {
    driverName: string;
    selectionDetails: Array<BetDetails> = [];
    hideEntry?: boolean = false;
}

export class RacerBetName {
    betName: string;
}

export class EachWayText {
    winOrEachWayText: string | null | undefined;
}

export class BetDetails {
    betName: string;
    betOdds: string;
    hideOdds: boolean;
    isRaceWinner: boolean;
    order: number;
    hideEntry: boolean;
    constructor(betName: string, betOdds: string, hideOdds: boolean = false, hideEntry: boolean = false) {
        this.betName = betName;
        this.betOdds = betOdds;
        this.hideOdds = hideOdds;
        this.hideEntry = hideEntry;
    }
}

export class MarketSelection {
    selectionName: string;
    betdetails: BetDetails;
    hideEntry?: boolean = false;
}