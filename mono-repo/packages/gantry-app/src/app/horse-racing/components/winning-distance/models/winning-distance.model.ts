import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';
import { PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { HorseRacingContent } from '../../../models/horseracing-content.model';

export class WinningDistanceResult extends PaginationContent {
    categoryName: string | null | undefined;
    marketTitle: string | null | undefined;
    winOrEachWayText: string | null | undefined;
    date: Date | null | undefined;
    events: Array<WinningDistanceEvent>;
    gantryCommonContent?: GantryCommonContent;
    horseRacingContent?: HorseRacingContent;
}

export class WinningDistanceEvent {
    name: string | null | undefined;
    eventDateTime?: Date | null | undefined;
    selections: Array<WinningDistanceSelection>;
}

export class WinningDistanceSelection {
    name: string | null | undefined;
    price: string | null | undefined;
    order: number;
    hideEntry?: boolean | null | undefined;
}
