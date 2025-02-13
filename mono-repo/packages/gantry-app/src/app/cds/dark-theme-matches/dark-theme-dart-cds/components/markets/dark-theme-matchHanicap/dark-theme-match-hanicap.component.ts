import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { DartCdsTemplateResult } from '../../../../../matches/dart-cds/models/dart-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-hanicap',
    templateUrl: './dark-theme-match-hanicap.component.html',
    styleUrls: ['./dark-theme-match-hanicap.component.scss'],
})
export class DarkThemeMatchHanicapComponent implements OnChanges {
    constructor() {}

    @Input() matchData: DartCdsTemplateResult;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as DartCdsTemplateResult | undefined;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market = marketDetails?.games?.filter((item) => item?.isMatchHandicap === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    if (selection.isMatchHandicap) {
                        this.selectionData.homePrice = selection?.matchHandicap?.homePrice;
                        this.selectionData.homeSelectionTitle = selection?.matchHandicap?.homePlayer;
                        this.selectionData.awayPrice = selection?.matchHandicap?.awayPrice;
                        this.selectionData.awaySelectionTitle = selection?.matchHandicap?.awayPlayer;
                        this.selectionData.title = marketDetails?.content?.contentParameters?.Handicap ?? '';
                        this.selectionData.drawMarketAvailable = false;
                        this.selectionData.trimTitleRequired = false;
                    }
                });
            }
        }
    }
}
