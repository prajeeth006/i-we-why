import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { Game, TennisCdsContent, TennisContentParams } from '../../../../matches/tennis/models/tennis-cds-content.model';
import { DarkThemeCommonMatches } from '../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-betting',
    templateUrl: './dark-theme-match-betting.component.html',
    styleUrl: './dark-theme-match-betting.component.scss',
})
export class DarkThemeMatchBettingComponent implements OnChanges {
    @Input() matchData: TennisCdsContent;
    @Input() content: TennisContentParams;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();
    nameLength = SelectionNameLength.Seventeen;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails: Game[] = change?.matchData?.currentValue as Game[];
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails && marketDetails?.length > 0) {
            const market: Game[] = marketDetails?.filter((item) => item?.isMatchBetting === true);
            if (market && market?.length > 0) {
                market.forEach((selection) => {
                    this.selectionData.title = this.content?.contentParameters?.MatchBetting ?? '';
                    this.selectionData.marketVersesName = this?.content?.contentParameters?.V ?? '';
                    if (selection.isMatchBetting) {
                        this.selectionData.homePrice = selection?.matchBetting?.homeBettingPrice;
                        this.selectionData.homeSelectionTitle = selection?.matchBetting?.homePlayer;
                        this.selectionData.awayPrice = selection?.matchBetting?.awayBettingPrice;
                        this.selectionData.awaySelectionTitle = selection?.matchBetting?.awayPlayer;
                        this.selectionData.drawMarketAvailable = true;
                        this.selectionData.trimTitleRequired = true;
                    }
                });
            }
        }
    }
}
