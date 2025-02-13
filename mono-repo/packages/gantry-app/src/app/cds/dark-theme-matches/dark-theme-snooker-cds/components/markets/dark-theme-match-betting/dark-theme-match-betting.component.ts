import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { Game, SnookerCdsTemplateResult } from '../../../../../matches/snooker-cds/models/snooker-cds-template.model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-betting',
    templateUrl: './dark-theme-match-betting.component.html',
    styleUrls: ['./dark-theme-match-betting.component.scss'],
})
export class DarkThemeMatchBettingComponent implements OnChanges {
    constructor() {}

    @Input() matchData: SnookerCdsTemplateResult;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();
    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails?.games && marketDetails?.games?.length > 0) {
            const market: Game[] = marketDetails?.games?.filter((item) => item?.isMatchBetting === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    this.selectionData.title = marketDetails?.content?.contentParameters?.MatchBetting ?? '';
                    this.selectionData.marketVersesName = marketDetails?.content?.contentParameters?.V ?? '';
                    if (selection.isMatchBetting) {
                        if (selection?.matchBetting?.drawPrice) {
                            this.selectionData.marketVersesName = '';
                            this.selectionData.title = marketDetails?.content?.contentParameters?.Draw ?? '';
                        }
                        this.selectionData.homePrice = selection?.matchBetting?.homePrice;
                        this.selectionData.homeSelectionTitle = selection?.matchBetting?.homePlayer;
                        this.selectionData.awayPrice = selection?.matchBetting?.awayPrice;
                        this.selectionData.awaySelectionTitle = selection?.matchBetting?.awayPlayer;
                        this.selectionData.drawPrice = selection?.matchBetting?.drawPrice ? selection?.matchBetting?.drawPrice : '';
                        this.selectionData.drawSuspended = selection?.matchBetting?.drawSuspended;
                        this.selectionData.drawMarketAvailable = true;
                        this.selectionData.trimTitleRequired = true;
                    }
                });
            }
        }
    }
}
