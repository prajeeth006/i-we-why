import { GantryCommonContent } from "src/app/common/models/gantry-commom-content.model";
import { PaginationContent } from "src/app/common/models/pagination/pagination.models";

export class WinningDistanceResult extends PaginationContent {
    categoryName: string;
    marketTitle: string;
    winOrEachWayText: string;
    date: Date;
    events: Array<WinningDistanceEvent>;
    gantryCommonContent: GantryCommonContent;
}

export class WinningDistanceEvent {
    name: string;
    eventDateTime?: Date;
    selections: Array<WinningDistanceSelection>;
}

export class WinningDistanceSelection {
    name: string;
    price: string;
    order: number;
    hideEntry?: boolean;
}