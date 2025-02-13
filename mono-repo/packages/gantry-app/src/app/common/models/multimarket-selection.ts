export class MultiMarket {
    title: string | null | undefined;
    marketVersesName?: string | null | undefined;
    homeTitle?: string | null | undefined;
    awayTitle?: string | null | undefined;
    trimValue?: boolean = true;
    selections: Array<MultiMarketSelection>;
}

export class MultiMarketSelection {
    selectionTitle?: string | null | undefined;
    drawTitle?: string | null | undefined;
    homePrice?: string | null | undefined;
    awayPrice?: string | null | undefined;
    drawPrice?: string | null | undefined;
    homeSelectionTitle?: string | null | undefined;
    awaySelectionTitle?: string | null | undefined;
    hideHomePrice?: boolean;
    hideAwayPrice?: boolean;
    hideDrawPrice?: boolean;
    hideHomeTitle?: boolean;
    hideAwayTitle?: boolean;
    hideDrawTitle?: boolean;
    drawSuspended?: boolean;
}
