import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../../common/models/multimarket-selection';
import { BetDetails, SnookerCdsTemplateResult } from '../../../../../matches/snooker-cds/models/snooker-cds-template.model';

@Component({
    selector: 'gn-dark-theme-frame-betting',
    templateUrl: './dark-theme-frame-betting.component.html',
    styleUrls: ['./dark-theme-frame-betting.component.scss'],
})
export class DarkThemeFrameBettingComponent implements OnChanges {
    constructor() {}

    @Input() matchData: SnookerCdsTemplateResult;
    leftBetList: Map<string, BetDetails>;
    rightBetList: Map<string, BetDetails>;
    multiMarket: MultiMarket = new MultiMarket();
    scoreList: Array<string> = [];
    nameLength = SelectionNameLength.Seventeen;
    @Input() isDrawMarketListed: boolean;

    ngOnChanges(change: { [market: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as SnookerCdsTemplateResult;
        this.leftBetList = new Map<string, BetDetails>();
        this.rightBetList = new Map<string, BetDetails>();

        if (marketDetails) {
            this.multiMarket.title = marketDetails?.content?.contentParameters?.SelectedCorrectScores ?? '';
            this.multiMarket.selections = [];

            marketDetails?.frameBetting?.homeTeamScorerList?.forEach((oddDetails) => {
                this.scoreList.push(oddDetails.betName);
                this.leftBetList.set(oddDetails.betName, oddDetails);
            });
            marketDetails?.frameBetting?.awayTeamScorerList?.forEach((oddDetails) => {
                this.scoreList.push(oddDetails.betName);
                this.rightBetList.set(oddDetails.betName, oddDetails);
            });

            this.scoreList?.sort((a, b) => (a > b ? -1 : 1));
            this.scoreList = Array.from(new Set(this.scoreList))?.slice(0, 3);

            if (
                (marketDetails?.frameBetting?.homeTeamScorerList && marketDetails?.frameBetting?.homeTeamScorerList?.length > 0) ||
                (marketDetails?.frameBetting?.homeTeamScorerList && marketDetails?.frameBetting?.homeTeamScorerList?.length > 0)
            )
                this.scoreList.forEach((score) => {
                    if (this.leftBetList.get(score) || this.rightBetList.get(score))
                        this.multiMarket.selections.push({
                            homePrice: this.leftBetList.get(score)?.betOdds,
                            selectionTitle: score?.replace('-', ' - '),
                            awayPrice: this.rightBetList.get(score)?.betOdds,
                        });
                });
        }
    }
}
