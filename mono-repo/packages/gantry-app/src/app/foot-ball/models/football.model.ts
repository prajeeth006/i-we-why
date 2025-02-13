import { SportBookMarketStructured } from '../../common/models/data-feed/sport-bet-models';
import { GantryCommonContent } from '../../common/models/gantry-commom-content.model';
import { SportContentParameters } from '../../common/models/sport-content/sport-content-parameters.model';

export class FootBallDataContent extends SportContentParameters {}

export class FootballContent {
    eventName: string;
    marketContents: Array<SportBookMarketStructured> = [];
    marketResult: MarketResult;
    gantryCommonContent: GantryCommonContent;
    content: FootBallDataContent;
    constructor() {
        this.marketResult = new MarketResult();
    }
}

export class MarketResult {
    leadTitle?: string | null | undefined;
    eventName?: string | null | undefined;
    eventDateTime?: Date | null | undefined;
    subTitleLeft?: string | null | undefined;
    subTitleRight?: string | null | undefined;

    homeTitle?: string | null | undefined;
    awayTitle?: string | null | undefined;
    drawTitle?: string | null | undefined;

    leftStipulatedLine?: string | null | undefined;
    rightStipulatedLine?: string | null | undefined;

    matchResult?: Market = new Market();
    firstGoalScorer?: Market = new Market();
    correctScore?: Market = new Market();
    halfOrFullTime?: Market = new Market();
    bothTeamsToScore?: Market = new Market();
    totalGoalsInTheMatch?: Market = new Market();
    matchResultBothTeamsToScore?: Market = new Market();

    moneyLine?: Market = new Market();
    handicapBetting?: Market = new Market();
    TotalPoints?: Market = new Market();
    FirstHalfHandicap?: Market = new Market();
    winningMargin?: Market = new Market();
    firstTouchdownScorer?: Market = new Market();

    homeTeamTitle: string;
    awayTeamTitle: string;
    nameLengthAndTrimEnd?: string | null | undefined;
    constructor(leadTitle?: string) {
        this.leadTitle = leadTitle;
    }
}

export class Market {
    marketType?: string | null | undefined;
    marketTitle: string | null | undefined;
    marketDisplayTitle: string | null | undefined;
    marketSubTitle?: string | null | undefined;
    marketLeftTitle?: string | null | undefined;
    marketRightTitle?: string | null | undefined;
    leftBetList: Array<BetDetails> = [];
    rightBetList: Array<BetDetails> = [];
    drawBetList?: Array<BetDetails> = [];
    tieTitle?: BetDetails;
    allBetList?: Array<BetDetails> = [];
    isHandicapValue?: boolean = false;
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
