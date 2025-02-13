import { GantryCommonContent } from "src/app/common/models/gantry-commom-content.model";
import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model";

export class HomeAwayData {
    contentParameters?: any;
    sportName?: string;
    tournamentName?: string;
    result?: HomeAwayResult;
    eventDateTimeInputValue: string;
}

export class HomeAwayResult {
    gantryCommonContent: GantryCommonContent;
    homeAwayEvent: Array<HomeAway>;
    categoryName?: string;
}

export class HomeAway {
    eventDateTime?: Date;
    homeSelection: HomeAwaySelection;
    awaySelection: HomeAwaySelection
}

export class HomeAwaySelection {
    selectionName: string;
    price: string;
}

export class TennisContentParams extends SportContentParameters{
}
