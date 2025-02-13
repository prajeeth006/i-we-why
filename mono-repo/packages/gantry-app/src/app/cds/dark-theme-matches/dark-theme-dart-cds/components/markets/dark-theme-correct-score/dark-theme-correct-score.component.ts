import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../../common/models/multimarket-selection';
import { DartCdsTemplateResult, NewSelection } from '../../../../../matches/dart-cds/models/dart-cds-template.model';

@Component({
    selector: 'gn-dark-theme-frame-betting',
    templateUrl: './dark-theme-correct-score.component.html',
    styleUrls: ['./dark-theme-correct-score.component.scss'],
})
export class DarkThemeCorrectScoreComponent implements OnChanges {
    constructor() {}

    @Input() matchData: DartCdsTemplateResult;
    multiMarket: MultiMarket = new MultiMarket();
    scoreList: Array<string> = [];
    nameLength = SelectionNameLength.Seventeen;
    @Input() iscorrect: string;

    ngOnChanges(change: { [market: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as DartCdsTemplateResult;

        if (marketDetails && marketDetails?.games?.length) {
            this.multiMarket.title = marketDetails?.content?.contentParameters?.SelectedCorrectScores ?? '';
            this.multiMarket.selections = [];
            const frameBetting = marketDetails?.games?.filter((x) => x.isFrameBetting == true)[0]?.frameBetting;
            const scoreList = frameBetting?.slice(0, 3);
            scoreList?.forEach((score: NewSelection) => {
                this.multiMarket?.selections?.push({
                    homePrice: score?.homeBettingPrice,
                    selectionTitle: score?.scorePoint?.replace('-', ' - '),
                    awayPrice: score?.awayBettingPrice,
                });
            });
        }
    }
}
