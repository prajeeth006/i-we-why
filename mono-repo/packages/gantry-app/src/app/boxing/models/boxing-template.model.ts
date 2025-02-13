import { BoxingDataContent } from './boxing-content.model';

export class BoxingTemplateContent {
    leadTitle: string | null | undefined;
    additionalInfo: string | null | undefined;
    optionalInfo: string | null | undefined;
    onRequest: string | null | undefined;
    moreMarkets: string | null | undefined;
    eventName: string | null | undefined;
    mainEventInfoPanel: MatchData;
    roundBettingInfoPanel: MatchDataList;
    groupRoundBettingInfoPanel: MatchDataList;
    methodOfVictoryInfoPanel: MatchDataList;

    homeFighterTitle: string | null | undefined;
    awayFighterTitle: string | null | undefined;
    eventDateTime?: Date | null | undefined;
    boxingDataContent?: BoxingDataContent;
}

export class MatchData {
    homeFighterDetails: BetDetails;
    awayFighterDetails: BetDetails;
    drawDetails: BetDetails;
    marketDisplayTitle: string;
}

export class MatchDataList {
    marketName: string;
    homeTeamListDetails: Array<BetDetails> = [];
    awayTeamListDetails: Array<BetDetails> = [];
    marketDisplayTitle: string;
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
