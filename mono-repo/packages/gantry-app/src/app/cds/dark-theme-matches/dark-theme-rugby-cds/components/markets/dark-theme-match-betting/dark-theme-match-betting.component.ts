import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../../common/models/multimarket-selection';
import { Game, RugbyCdsTemplateResult } from '../../../../../matches/rugby-cds/models/rugby-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-betting',
    templateUrl: './dark-theme-match-betting.component.html',
    styleUrls: ['./dark-theme-match-betting.component.scss'],
})
export class DarkThemeMatchBettingComponent implements OnChanges {
    @Input() matchData: RugbyCdsTemplateResult;
    multiMarket: MultiMarket = new MultiMarket();
    nameLength = SelectionNameLength.Seventeen;
    gamesCount: number = 0;
    selectionData: DarkThemeCommonMatches;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as RugbyCdsTemplateResult;
        this.selectionData = new DarkThemeCommonMatches();
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market: Game[] = marketDetails?.games?.filter((item) => item?.isMatchBetting === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    if (selection.isMatchBetting) {
                        this.selectionData.homePrice = selection?.matchBetting?.homePrice;
                        this.selectionData.homeSelectionTitle = selection?.matchBetting?.homePlayer;
                        this.selectionData.awayPrice = selection?.matchBetting?.awayPrice;
                        this.selectionData.awaySelectionTitle = selection?.matchBetting?.awayPlayer;
                        this.selectionData.drawTitle = selection?.matchBetting?.drawPlayer;
                        this.selectionData.drawPrice = selection?.matchBetting?.drawPrice;
                        this.selectionData.drawSuspended = selection?.matchBetting?.drawSuspended;
                        this.selectionData.drawMarketAvailable = true;
                        this.selectionData.trimTitleRequired = true;
                        this.selectionData.title = marketDetails?.drawTitle;
                        this.selectionData.marketVersesName = '';
                    }
                });
            }
        }
    }

    constructor() {}
}
