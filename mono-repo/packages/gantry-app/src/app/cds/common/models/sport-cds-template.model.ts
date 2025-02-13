export class SportCdsTemplateModel {
    startDate: string;
    title: string;
    competitionName: string;
    context: string;
}

export class MarketDetails {
    id: number;
    marketName: string;
    marketSelections: MarketSelection;
    status?: string;
    drawTitle?: string;
}

export class MarketSelection {
    home: BetDetails;
    draw?: BetDetails;
    away: BetDetails;
}

export class TopTeamRunScorer {
    id: number;
    marketName: string;
    status: string;
    topRunScorer: Array<BetDetails> = [];
}

export class BetDetails {
    betName: string;
    betOdds: string;
    status?: string;
}

export enum VisibilityFlags {
    Status = 'status',
    Visibility = 'visibility',
}

export class CdsPriceDetails {
    id: number;
    numerator?: number;
    denominator?: number;
    odds: number;
    americanOdds?: number;
}
