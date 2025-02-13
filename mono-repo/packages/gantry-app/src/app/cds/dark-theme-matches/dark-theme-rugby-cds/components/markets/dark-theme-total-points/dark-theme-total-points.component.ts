import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { RugbyCdsTemplateResult } from '../../../../../matches/rugby-cds/models/rugby-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-total-points',
    templateUrl: './dark-theme-total-points.component.html',
    styleUrls: ['./dark-theme-total-points.component.scss'],
})
export class DarkThemeTotalPointsComponent implements OnChanges {
    selectionData: DarkThemeCommonMatches;
    constructor() {}

    @Input() matchData: RugbyCdsTemplateResult;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
        this.selectionData = new DarkThemeCommonMatches();
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market = marketDetails?.games?.filter((item) => item?.isTotalPointsBetting === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    if (selection.isTotalPointsBetting) {
                        this.selectionData.homePrice = selection?.totalPointsBetting?.awayPrice;
                        this.selectionData.homeSelectionTitle = selection?.totalPointsBetting?.awayPlayer;
                        this.selectionData.awayPrice = selection?.totalPointsBetting?.homePrice;
                        this.selectionData.awaySelectionTitle = selection?.totalPointsBetting?.homePlayer;
                        this.selectionData.title = marketDetails?.content?.contentParameters?.TotalPoints ?? '';
                    }
                });
            }
        }
    }
}
