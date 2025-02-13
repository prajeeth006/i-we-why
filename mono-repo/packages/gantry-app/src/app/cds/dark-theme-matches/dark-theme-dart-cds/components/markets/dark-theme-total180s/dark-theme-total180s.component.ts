import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { DartCdsTemplateResult } from '../../../../../matches/dart-cds/models/dart-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-totalframes-betting',
    templateUrl: './dark-theme-total180s.component.html',
    styleUrls: ['./dark-theme-total180s.component.scss'],
})
export class DarkThemeTotal180sComponent implements OnChanges {
    constructor() {}

    @Input() matchData: DartCdsTemplateResult;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();
    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as DartCdsTemplateResult;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market = marketDetails?.games?.filter((item: any) => item?.isTotalFrames === true);
            if (market && market?.length > 0) {
                market.forEach((selection: any) => {
                    if (selection.isTotalFrames) {
                        this.selectionData.homePrice = selection?.totalFrames?.awayPrice;
                        this.selectionData.homeSelectionTitle = selection?.totalFrames?.awayPlayer;
                        this.selectionData.awayPrice = selection?.totalFrames?.homePrice;
                        this.selectionData.awaySelectionTitle = selection?.totalFrames?.homePlayer;
                        this.selectionData.title = marketDetails?.content?.contentParameters?.Total180S ?? '';
                        this.selectionData.drawMarketAvailable = false;
                        this.selectionData.trimTitleRequired = true;
                    }
                });
            }
        }
    }
}
