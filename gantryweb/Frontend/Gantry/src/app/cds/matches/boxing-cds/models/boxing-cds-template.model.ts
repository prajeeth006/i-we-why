import { BoxingDataContent } from "src/app/boxing/models/boxing-content.model";


export class BoxingTemplateContent {
    leadTitle: string;
    additionalInfo: string;
    optionalInfo: string;
    onRequest: string;
    moreMarkets: string;
    eventName: string;
    mainEventInfoPanel: MatchData;
    roundBettingInfoPanel: MatchDataList;
    groupRoundBettingInfoPanel: MatchDataList;
    methodOfVictoryInfoPanel: MatchDataList;
    homeFighterTitle: string;
    awayFighterTitle: string;
    eventDateTime?: Date;
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
}