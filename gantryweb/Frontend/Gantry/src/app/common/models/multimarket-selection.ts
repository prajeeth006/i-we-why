

export class MultiMarket {
    title: string;
    marketVersesName?: string;
    homeTitle?: string;
    awayTitle?: string;
    trimValue?: boolean = true;
    selections?: Array<MultiMarketSelection>;
}

export class MultiMarketSelection {
    selectionTitle?: string;
    drawTitle?:string;
    homePrice?: string;
    awayPrice?: string;
    drawPrice?: string;
    homeSelectionTitle?: string;
    awaySelectionTitle?: string;
    hideHomePrice?: boolean;
    hideAwayPrice?: boolean;
    hideDrawPrice?: boolean;
    hideHomeTitle?: boolean;
    hideAwayTitle?: boolean;
    hideDrawTitle?:boolean;

}