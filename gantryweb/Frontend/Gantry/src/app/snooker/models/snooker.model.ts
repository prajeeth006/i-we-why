import { SportBookMarketStructured } from "src/app/common/models/data-feed/sport-bet-models";
import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model";

export class SnookerDataContent extends SportContentParameters {
}

export class SnookerContent {
    eventName: string;
    marketContents: Array<SportBookMarketStructured> = [];
    marketResult: SnookerMarketResult;
    snookerDataContent: SnookerDataContent
    constructor() {
        this.marketResult = new SnookerMarketResult();
    }
}
export class SnookerMarketResult {
    leadTitle?: string;
    eventName?: string;
    eventDateTime?: Date;
    additionalInfo: string;
    optionalInfo: string;

    homeTitle?: string;
    awayTitle?: string;
    drawTitle?: string;

    leftStipulatedLine?: string;
    rightStipulatedLine?: string;

    matchResult?: Market;
    correctScore?: Market;
    handicapScorer?: Market;
    totalframes?: Market;
    towinfirstframe?: Market;
    handicapBetting?: Market;
    homeTeamTitle?: string;
    awayTeamTitle?: string;
    finalBestFrame?: string;
    isCorrectScore?: boolean = false
    constructor(leadTitle?: string) {
        this.leadTitle = leadTitle;
    }
}

export class Market {
    marketType?: string;
    marketTitle: string;
    marketDisplayTitle: string;
    marketVersesName?: string;
    marketSubTitle?: string;
    isHandicapValue?: boolean = false;
    leftBetList: Array<BetDetails> = [];
    rightBetList: Array<BetDetails> = [];
    drawBetList?: Array<BetDetails> = [];
    allBetList?: Array<BetDetails> = [];
    bestOfLeftFrame: Array<frameDetails> = [];
    bestOfRightFrame: Array<frameDetails> = [];
}

export class BetDetails {
    betName: string;
    betOdds: string;
    order: number;
    hideOdds: boolean;
    hideEntry: boolean;
    constructor(betName: string, betOdds: string, hideOdds: boolean = false, hideEntry: boolean = false) {
        this.betName = betName;
        this.betOdds = betOdds;
        this.hideOdds = hideOdds;
        this.hideEntry = hideEntry;
    }
}

export class frameDetails {
    frameOdds: string;
}
