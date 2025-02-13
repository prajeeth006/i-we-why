import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SnookerCdsTemplateResult } from '../../../../../matches/snooker-cds/models/snooker-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-handicap',
    templateUrl: './dark-theme-match-handicap.component.html',
    styleUrls: ['./dark-theme-match-handicap.component.scss'],
})
export class DarkThemeMatchHandicapComponent implements OnChanges {
    constructor() {}

    @Input() matchData: SnookerCdsTemplateResult;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market = marketDetails?.games?.filter((item) => item?.isMatchHandicap === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    if (selection.isMatchHandicap) {
                        this.selectionData.homePrice = selection?.matchHanicap?.homePrice;
                        this.selectionData.homeSelectionTitle = selection?.matchHanicap?.homePlayer;
                        this.selectionData.awayPrice = selection?.matchHanicap?.awayPrice;
                        this.selectionData.awaySelectionTitle = selection?.matchHanicap?.awayPlayer;
                        this.selectionData.title = marketDetails?.content?.contentParameters?.Handicap ?? '';
                        this.selectionData.trimTitleRequired = false;
                    }
                });
            }
        }
    }
}
