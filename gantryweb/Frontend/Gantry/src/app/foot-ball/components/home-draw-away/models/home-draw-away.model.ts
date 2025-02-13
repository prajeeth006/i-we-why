import { GantryCommonContent } from "src/app/common/models/gantry-commom-content.model";

export class HomeDrawAwayResult {
    gantryCommonContent: GantryCommonContent;
    homeDrawAwayEvent: Array<HomeDrawAway>;
    marketName?: string;
    categoryName?: string;
}

export class HomeDrawAway {
    eventName: string;
    eventTime: string;
    eventDateTime?: Date;
    homeSelection: HomeDrawAwaySelection;
    drawSelection: HomeDrawAwaySelection;
    awaySelection: HomeDrawAwaySelection
}

export class HomeDrawAwaySelection {
    selectionName: string;
    price: string;
    hidePrice: boolean;
    hideEntry?: boolean = false;
}