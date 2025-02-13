import { CricketDataContent } from "./cricket-content.model";
import { CricketCountriesContent } from "./cricket-countries.model";

export class CricketTemplateResult {
    mainEventInfoPanel: MatchData;
    topRunScorer: TopRunScorerList;
    top1stInningRunScorer: TopRunScorerList;
    totalSixes: MatchData;
    tossOrLeadInfoPanel: MatchData;
    toScore100in1stInns: Array<BetDetails>;

    manOfTheMatchInfoPanel: ManOfTheMatchList; //If we want to display based on home or away
    title: string;
    eventName: string;
    isTestMatch: boolean = false;
    manOfTheMatchPlayerPanel: ManOfTheMatchPlayers; // If we want to display in least price order
    topRunsPanel: TopRunScorers; // If we want to display in least price order
    secondTeamTopRunsPanel: TopRunScorers; // For storing First market when Two markets with runscorers are available
    leadTitle: string;
    additionalInfo: string;
    optionalInfo: string;
    onRequest: string;
    moreMarkets: string;
    eventDateTime?: Date;
    cricketContent?: CricketDataContent;
    cricketCountries?: Array<CricketCountriesContent>;
    homeCountry?: CricketCountriesContent;
    awayCountry?: CricketCountriesContent;

}

export class MatchData {
    homeTeamDetails: BetDetails;
    awayTeamDetails: BetDetails;
    drawMatchDetails: BetDetails;
    marketName?: string;
    marketVersesName?: string;
}

export class ManOfTheMatchList {
    homeTeamManOfTheMatchShortest: BetDetails;
    awayTeamManOfTheMatchShortest: BetDetails;
    homeTeamManOfTheMatchSecondShortest: BetDetails;
    awayTeamManOfTheMatchSecondShortest: BetDetails;
}

export class ManOfTheMatchPlayers {
    manOfTheMatchPlayerList: Array<BetDetails>;
}

export class TopRunScorers {
    topRunScorerPlayerList: Array<BetDetails>;
}

export class TopRunScorerList {
    homeTeamTopRunScorerList: Array<BetDetails>;
    awayTeamTopRunScorerList: Array<BetDetails>;
}

export class BetDetails {
    betName: string;
    betOdds: string;
    hideOdds: boolean;
    hideEntry: boolean;
    constructor(betName: string, betOdds: string, hideOdds: boolean = false, hideEntry: boolean = false) {
        this.betName = betName;
        this.betOdds = betOdds;
        this.hideOdds = hideOdds;
        this.hideEntry = hideEntry;
    }
}
