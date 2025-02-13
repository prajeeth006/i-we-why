import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CricketCdsTemplateModel } from '../../../../../../../app/cds/common/models/cricket-cds-template.model';
import { TopTeamRunScorer } from '../../../../../../../app/cds/common/models/sport-cds-template.model';
import { MultiMarket } from '../../../../../../../app/common/models/multimarket-selection';

@Component({
    selector: 'gn-dark-top-runscorer',
    templateUrl: './dark-theme-top-runscorer.component.html',
    styleUrls: ['./dark-theme-top-runscorer.component.scss'],
})
export class DarkThemeTopRunscorerComponent implements OnChanges {
    @Input() matchData: CricketCdsTemplateModel;
    multiMarket: MultiMarket = new MultiMarket();
    constructor() {}

    prepareResult(markets: TopTeamRunScorer[], maxLimit: number) {
        Array.from({ length: maxLimit }).map((x, i) => {
            if (markets && markets.length == 2) {
                const [topHomeRunScorer, topAwayRunScorer] = markets;
                if (topHomeRunScorer?.topRunScorer?.length > 0 || topAwayRunScorer?.topRunScorer?.length > 0) {
                    this.multiMarket.selections.push({
                        homePrice: topHomeRunScorer?.topRunScorer[i]?.betOdds ?? '',
                        homeSelectionTitle: topHomeRunScorer?.topRunScorer[i]?.betName ?? '',
                        awayPrice: topAwayRunScorer.topRunScorer[i]?.betOdds ?? '',
                        awaySelectionTitle: topAwayRunScorer.topRunScorer[i]?.betName ?? '',
                    });
                }
            }
        });
    }

    ngOnChanges(change: SimpleChanges) {
        const marketDetails = change?.matchData?.currentValue as CricketCdsTemplateModel;
        if (!!marketDetails?.gameInfo?.gameFlags) {
            const gameFlags = marketDetails?.gameInfo?.gameFlags;
            this.multiMarket.title = gameFlags?.isTestMatch
                ? (marketDetails?.content?.contentParameters?.TopFirstInningsRunScorer ?? '')
                : (marketDetails?.content?.contentParameters?.TopRunScorer ?? '');

            const newDesignTopRunScorerLimitTest = marketDetails?.content?.contentParameters?.NewDesignTopRunScorerLimitTest ?? 6;
            const newDesignTopRunScorerLimitODI = marketDetails?.content?.contentParameters?.NewDesignTopRunScorerLimitODI ?? 4;

            this.multiMarket.selections = [];

            const topHomeRunScorer: TopTeamRunScorer = marketDetails?.gameInfo?.markets?.topHomeRunScorer ?? new TopTeamRunScorer();
            const topAwayRunScorer: TopTeamRunScorer = marketDetails?.gameInfo?.markets?.topAwayRunScorer ?? new TopTeamRunScorer();
            const markets: TopTeamRunScorer[] = [topHomeRunScorer, topAwayRunScorer];

            const maxLimit = gameFlags?.isTestMatch ? Number(newDesignTopRunScorerLimitTest) : Number(newDesignTopRunScorerLimitODI);
            const homeLength = topHomeRunScorer?.topRunScorer?.length;
            const awayLength = topAwayRunScorer?.topRunScorer?.length;
            const maxSelectionLength = Math.max(homeLength, awayLength);

            if (maxSelectionLength <= maxLimit) {
                this.prepareResult(markets, maxSelectionLength);
            } else {
                this.prepareResult(markets, maxLimit);
            }
        }
    }
}
