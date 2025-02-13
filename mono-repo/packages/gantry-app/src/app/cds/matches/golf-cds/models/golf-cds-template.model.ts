import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class GolfCdsTemplateResult {
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName?: string;
    context?: string;
    marketVersesName?: string;
    golfData?: GolfData;
    content?: GolfContentParams;
    eventDateTimeInputValue?: string;
    drawTitle?: string;
}

export class GolfData {
    id?: number;
    gameName?: string;
    marketName?: string;
    gameDetails?: Array<GameDetails>;
}

export class GolfContentParams extends SportContentParameters {}
export class GameDetails {
    gameStartTime: Date;
    runnerDetails?: Array<BetDetails>;
}

export class BetDetails {
    betName: string;
    betOdds: string;
}
