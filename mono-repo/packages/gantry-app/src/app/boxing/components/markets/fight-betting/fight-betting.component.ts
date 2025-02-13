import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { MultiMarket } from '../../../../common/models/multimarket-selection';
import { MatchData } from '../../../models/boxing-template.model';

@Component({
    selector: 'gn-fight-betting',
    templateUrl: './fight-betting.component.html',
    styleUrls: ['./fight-betting.component.scss'],
})
export class FightBettingComponent implements OnChanges {
    @Input() matchData: MatchData;
    @Input() isTestMatch: boolean;
    multiMarket: MultiMarket = new MultiMarket();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as MatchData;
        this.multiMarket.title = marketDetails?.marketDisplayTitle;
        this.multiMarket.selections = [];

        if (marketDetails?.homeFighterDetails != null || marketDetails?.awayFighterDetails != null || marketDetails?.drawDetails != null)
            if (!marketDetails?.homeFighterDetails?.hideEntry || !marketDetails?.awayFighterDetails?.hideEntry) {
                Array.from({ length: 1 }).map(() => {
                    this.multiMarket.selections.push({
                        homePrice: marketDetails.homeFighterDetails?.betOdds,
                        hideHomePrice: marketDetails.homeFighterDetails?.hideOdds,
                        homeSelectionTitle: marketDetails.homeFighterDetails?.betName,
                        hideHomeTitle: marketDetails.homeFighterDetails?.hideEntry,
                        drawPrice: marketDetails.drawDetails?.betOdds ?? ' ',
                        hideDrawPrice: marketDetails.drawDetails?.hideOdds,
                        awayPrice: marketDetails.awayFighterDetails?.betOdds,
                        hideAwayPrice: marketDetails.awayFighterDetails?.hideOdds,
                        awaySelectionTitle: marketDetails.awayFighterDetails?.betName,
                        hideAwayTitle: marketDetails.awayFighterDetails?.hideEntry,
                    });
                });
            }
    }
    constructor() {}
}
