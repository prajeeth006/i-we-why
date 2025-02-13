import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../common/models/multimarket-selection';
import { FootBallDataContent } from '../../../../../foot-ball/models/football.model';
import { FootBallCdsTemplateResult } from '../../../../matches/foot-ball/foot-ball-cds-template/models/foot-ball-cds-template.model';

@Component({
    selector: 'gn-dark-theme-total-goals',
    templateUrl: './dark-theme-total-goals.component.html',
    styleUrl: './dark-theme-total-goals.component.scss',
})
export class DarkThemeTotalGoalsComponent implements OnChanges {
    @Input() matchData: FootBallCdsTemplateResult;

    nameLength = SelectionNameLength.Seventeen;
    multiMarket: MultiMarket = new MultiMarket();
    footBallContent: FootBallDataContent;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as FootBallCdsTemplateResult;
        this.multiMarket.title = marketDetails?.content?.contentParameters?.TotalGoalsInTheMatch ?? '';
        this.multiMarket.homeTitle = marketDetails?.content?.contentParameters?.Over ?? '';
        this.multiMarket.awayTitle = marketDetails?.content?.contentParameters?.Under ?? '';
        this.multiMarket.selections = marketDetails?.totalGoals?.selections?.sort((a: any, b: any) => a.name - b.name);
        this.footBallContent = marketDetails?.content;
    }

    constructor() {}
}
