import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { MultiMarket } from '../../../../common/models/multimarket-selection';
import { BetDetails, MatchDataList } from '../../../models/boxing-template.model';

@Component({
    selector: 'gn-method-of-victory',
    templateUrl: './method-of-victory.component.html',
    styleUrls: ['./method-of-victory.component.scss'],
})
export class MethodOfVictoryComponent implements OnChanges {
    constructor() {}

    @Input() matchData: MatchDataList;

    leftBetList: Map<string, BetDetails>;
    rightBetList: Map<string, BetDetails>;
    multiMarket: MultiMarket = new MultiMarket();

    roundValues: Array<string> = [];

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change.matchData.currentValue as MatchDataList;

        this.leftBetList = new Map<string, BetDetails>();
        this.rightBetList = new Map<string, BetDetails>();

        if (marketDetails) {
            this.multiMarket.title = marketDetails.marketDisplayTitle;
            this.multiMarket.selections = [];

            const homeBetNames = marketDetails?.homeTeamListDetails?.map((x) => x.betName);
            const awayBetNames = marketDetails?.awayTeamListDetails?.map((x) => x.betName);
            this.roundValues = homeBetNames
                ?.filter((t) => !awayBetNames?.includes(t))
                .concat(awayBetNames)
                ?.sort();

            marketDetails?.homeTeamListDetails?.forEach((oddDetails) => {
                switch (oddDetails.betName) {
                    case this.roundValues[0]:
                        this.leftBetList.set(oddDetails.betName, oddDetails);
                        break;
                    case this.roundValues[1]:
                        this.leftBetList.set(oddDetails.betName, oddDetails);
                        break;
                }
            });
            marketDetails?.awayTeamListDetails?.forEach((oddDetails) => {
                switch (oddDetails.betName) {
                    case this.roundValues[0]:
                        this.rightBetList.set(oddDetails.betName, oddDetails);
                        break;
                    case this.roundValues[1]:
                        this.rightBetList.set(oddDetails.betName, oddDetails);
                        break;
                }
            });
            this.multiMarket.trimValue = false;
            if (marketDetails?.homeTeamListDetails?.length > 0 || marketDetails?.awayTeamListDetails?.length > 0)
                this.roundValues.forEach((round) => {
                    if (this.leftBetList.get(round) || this.rightBetList.get(round))
                        if (!this.leftBetList.get(round)?.hideEntry || !this.rightBetList.get(round)?.hideEntry) {
                            this.multiMarket.selections.push({
                                selectionTitle: round,
                                homePrice: this.leftBetList.get(round)?.betOdds,
                                hideHomePrice: this.leftBetList.get(round)?.hideOdds,
                                hideHomeTitle: this.leftBetList.get(round)?.hideEntry,
                                awayPrice: this.rightBetList.get(round)?.betOdds,
                                hideAwayPrice: this.rightBetList.get(round)?.hideOdds,
                                hideAwayTitle: this.rightBetList.get(round)?.hideEntry,
                            });
                        }
                });
        }
    }
}
