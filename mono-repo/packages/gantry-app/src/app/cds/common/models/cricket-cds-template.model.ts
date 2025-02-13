import { CricketContentParams } from '../../matches/cricket-cds/models/cricket-cds-template.model';
import { MarketDetails, SportCdsTemplateModel, TopTeamRunScorer } from './sport-cds-template.model';

export class CricketCdsTemplateModel extends SportCdsTemplateModel {
    gameInfo: GameInfo;
    content: CricketContentParams;
}

export class GameInfo {
    id?: number;
    markets: Markets = new Markets();
    gameFlags: GameFlags = new GameFlags();
}

export class Markets {
    matchBetting: MarketDetails = new MarketDetails();
    topHomeRunScorer: TopTeamRunScorer = new TopTeamRunScorer();
    topAwayRunScorer: TopTeamRunScorer = new TopTeamRunScorer();
    totalSixes: MarketDetails = new MarketDetails();
}

export class GameFlags {
    isTestMatch: boolean = false;
    isSuperOver: boolean = false;
}
