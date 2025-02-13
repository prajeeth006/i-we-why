import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';
import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class HomeAwayData {
    contentParameters?: any;
    sportName?: string;
    competitionName?: string;
    result?: HomeAwayResult;
    eventDateTimeInputValue?: string | any[];
}

export class HomeAwayResult {
    gantryCommonContent: GantryCommonContent;
    homeAwayEvent: Array<HomeAway>;
    categoryName?: string;
}

export class HomeAway {
    eventDateTime: Date;
    homeSelection: HomeAwaySelection;
    awaySelection: HomeAwaySelection;
}

export class HomeAwaySelection {
    selectionName: string;
    price: string;
}

export class TennisContentParams extends SportContentParameters {}
