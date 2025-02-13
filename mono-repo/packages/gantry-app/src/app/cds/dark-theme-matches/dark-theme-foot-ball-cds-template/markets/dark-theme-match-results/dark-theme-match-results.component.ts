import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../common/models/multimarket-selection';
import { FootBallCdsTemplateResult } from '../../../../matches/foot-ball/foot-ball-cds-template/models/foot-ball-cds-template.model';

@Component({
    selector: 'gn-dark-theme-match-results',
    templateUrl: './dark-theme-match-results.component.html',
    styleUrl: './dark-theme-match-results.component.scss',
})
export class DarkThemeMatchResultsComponent implements OnChanges {
    @Input() matchData: FootBallCdsTemplateResult;

    multiMarket: MultiMarket = new MultiMarket();
    nameLength = SelectionNameLength.Seventeen;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
        this.multiMarket.title = marketDetails?.drawTitle || '';
        this.multiMarket.selections = marketDetails?.finalResult?.selections;
    }
    constructor() {}
}
