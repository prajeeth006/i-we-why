import { DartDataContent } from "./dart-data-content.model";

export class DartTemplateContent {
    leadTitle: string;
    additionalInfo: string;
    optionalInfo: string;
    onRequest: string;
    moreMarkets: string;
    eventName: string;
    mainEventInfoPanel: MatchData;
    handicapBettingInfoPanel: MatchData;
    correctScoreBettingInfoPanel: MatchDataList;
    most180SBettingInfoPanel: MatchData;

    homePlayerTitle: string;
    awayPlayerTitle: string;
    eventDateTime?: Date;
    dartDataContent?: DartDataContent;
    handicapValue?: number;
}

export class MatchData {
    homeTeamDetails: BetDetails;
    awayTeamDetails: BetDetails;
    drawDetails: BetDetails;
    marketName: string;
    marketVersesName?: string;
    isHandicapValue?: boolean = false;
}

export class MatchDataList {
    marketName: string;
    homeTeamListDetails: Array<BetDetails> = [];
    awayTeamListDetails: Array<BetDetails> = [];
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