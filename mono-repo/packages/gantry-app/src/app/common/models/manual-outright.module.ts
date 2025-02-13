import { GantryCommonContent } from './gantry-commom-content.model';
import { PaginationContent } from './pagination/pagination.models';

export class ManualOutRightResult extends PaginationContent {
    sportName: string | null | undefined;
    eventName: string | null | undefined;
    date: Date | null | undefined;
    time: string | null | undefined;
    Runners: Array<ManualOutRightSelection>;
    racingContent: GantryCommonContent;
    isEventResulted: boolean | null | undefined;
    raceoff: boolean | null | undefined;
    marketEachWay: string | null | undefined;
    outRightTitle: string | null | undefined;
    imageContent?: GantryCommonContent;
}

export class ManualOutRightSelection {
    selectionName: string | null | undefined;
    firstOdds: string | null | undefined;
    firstPlayer: string | null | undefined;
    draw: string | null | undefined;
    secondPlayer: string | null | undefined;
    secondOdds: string | null | undefined;
    odds: string | null | undefined;
    hidePrice?: boolean | null | undefined;
    hideEntry?: boolean | null | undefined;
    price: number | null | undefined;
}

export enum GameType {
    horses = 'horses',
    greyhounds = 'greyhounds',
    boxing = 'boxing',
    cricketODI = 'cricket (odi)',
    cricketTest = 'cricket (test)',
    darts = 'darts',
    football = 'football',
    golf = 'golf',
    formula1 = 'formula 1',
    nfl = 'nfl',
    rugbyLeague = 'rugby league',
    rugbyUnion = 'rugby union',
    snooker = 'snooker',
    tennis = 'tennis',
    specials = 'specials',
    politics = 'politics',
    olympics = 'olympics',
    cycling = 'cycling',
    entertainment = 'entertainment',
}
