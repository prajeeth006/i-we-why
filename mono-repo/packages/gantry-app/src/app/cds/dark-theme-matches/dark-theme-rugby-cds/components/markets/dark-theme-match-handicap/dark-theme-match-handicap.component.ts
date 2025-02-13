import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { RugbyCdsTemplateResult } from '../../../../../matches/rugby-cds/models/rugby-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-handicap',
    templateUrl: './dark-theme-match-handicap.component.html',
    styleUrls: ['./dark-theme-match-handicap.component.scss'],
})
export class DarkThemeMatchHandicapComponent implements OnChanges {
    @Input() matchData: RugbyCdsTemplateResult;
    selectionData: DarkThemeCommonMatches;

    constructor() {}

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
        this.selectionData = new DarkThemeCommonMatches();
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market = marketDetails?.games?.filter((item) => item?.isHandicapBetting === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    if (selection.isHandicapBetting) {
                        this.selectionData.homePrice = selection?.handicapBetting?.homePrice;
                        this.selectionData.homeSelectionTitle = selection?.handicapBetting?.homePlayer;
                        this.selectionData.awayPrice = selection?.handicapBetting?.awayPrice;
                        this.selectionData.awaySelectionTitle = selection?.handicapBetting?.awayPlayer;
                        this.selectionData.title = marketDetails?.content?.contentParameters?.Handicap ?? '';
                    }
                });
            }
        }
    }
}
