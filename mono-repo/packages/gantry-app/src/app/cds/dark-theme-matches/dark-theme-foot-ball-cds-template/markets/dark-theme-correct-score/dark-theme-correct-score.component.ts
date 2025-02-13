import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../common/models/multimarket-selection';
import { FootBallCdsTemplateResult } from '../../../../matches/foot-ball/foot-ball-cds-template/models/foot-ball-cds-template.model';

@Component({
    selector: 'gn-dark-theme-correct-score',
    templateUrl: './dark-theme-correct-score.component.html',
    styleUrl: './dark-theme-correct-score.component.scss',
})
export class DarkThemeCorrectScoreComponent implements OnChanges {
    @Input() matchData: FootBallCdsTemplateResult;

    multiMarket: MultiMarket = new MultiMarket();
    nameLength = SelectionNameLength.Seventeen;
    isTwoMarkets: boolean = false;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
        this.multiMarket.selections = marketDetails?.correctScore?.selections;
        this.isTwoMarkets = !!marketDetails?.hasCorrectScoreAndfirstGoalScorer;
    }
    constructor() {}
}
