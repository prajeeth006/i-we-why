import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../common/models/multimarket-selection';
import { FootBallCdsTemplateResult } from '../../../../matches/foot-ball/foot-ball-cds-template/models/foot-ball-cds-template.model';

@Component({
    selector: 'gn-dark-theme-both-teams-to-score',
    templateUrl: './dark-theme-both-teams-to-score.component.html',
    styleUrl: './dark-theme-both-teams-to-score.component.scss',
})
export class DarkThemeBothTeamsToScoreComponent implements OnChanges {
    @Input() matchData: FootBallCdsTemplateResult;
    multiMarket: MultiMarket = new MultiMarket();
    nameLength = SelectionNameLength.Seventeen;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
        this.multiMarket.title = marketDetails?.content?.contentParameters?.BothTeamsToScore ?? '';
        this.multiMarket.selections = marketDetails?.bothTeamScore?.selections;
    }

    constructor() {}
}
