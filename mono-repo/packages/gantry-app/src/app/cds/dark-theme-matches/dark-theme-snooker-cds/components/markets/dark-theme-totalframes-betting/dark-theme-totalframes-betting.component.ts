import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SnookerCdsTemplateResult } from '../../../../../matches/snooker-cds/models/snooker-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-totalframes-betting',
    templateUrl: './dark-theme-totalframes-betting.component.html',
    styleUrls: ['./dark-theme-totalframes-betting.component.scss'],
})
export class DarkThemeTotalframesBettingComponent implements OnChanges {
    constructor() {}

    @Input() matchData: SnookerCdsTemplateResult;
    @Input() isDrawMarketListed: boolean;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();
    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market = marketDetails?.games?.filter((item) => item?.isTotalFrames === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    if (selection.isTotalFrames) {
                        this.selectionData.homePrice = selection?.totalFrames?.awayPrice;
                        this.selectionData.homeSelectionTitle = selection?.totalFrames?.awayPlayer;
                        this.selectionData.awayPrice = selection?.totalFrames?.homePrice;
                        this.selectionData.awaySelectionTitle = selection?.totalFrames?.homePlayer;
                        this.selectionData.title = marketDetails?.content?.contentParameters?.TotalFrames ?? '';
                        this.selectionData.trimTitleRequired = true;
                    }
                });
            }
        }
    }
}
