import { GantryCommonContent } from "./gantry-commom-content.model";
import { PaginationContent } from "./pagination/pagination.models";

export class ManualOutRightResult extends PaginationContent {
    sportName: string | null | undefined;
    eventName: string | null | undefined;
    date: Date | null | undefined;
    time: string | null | undefined;
    Runners: Array<ManualOutRightSelection>;
    racingContent: GantryCommonContent;
    isEventResulted: boolean | null | undefined;
    raceoff: boolean | null | undefined;
    marketEachWay: string | null;
    outRightTitle: string;
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