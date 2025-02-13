import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';

export class HomeDrawAwayResult {
    gantryCommonContent: GantryCommonContent;
    homeDrawAwayEvent: Array<HomeDrawAway>;
    marketName?: string | null | undefined;
    categoryName?: string | null | undefined;
}

export class HomeDrawAway {
    eventName: string | null | undefined;
    eventTime: string | null | undefined;
    eventDateTime: Date;
    homeSelection: HomeDrawAwaySelection;
    drawSelection: HomeDrawAwaySelection;
    awaySelection: HomeDrawAwaySelection;
}

export class HomeDrawAwaySelection {
    selectionName: string | null | undefined;
    price: string | null | undefined;
    hidePrice: boolean;
    hideEntry?: boolean = false;
}
