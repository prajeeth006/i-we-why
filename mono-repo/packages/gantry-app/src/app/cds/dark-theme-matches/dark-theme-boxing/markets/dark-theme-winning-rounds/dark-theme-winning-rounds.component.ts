import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { BoxingCdsContent, MultiMarket } from '../../../../matches/boxing-cds/models/boxing-cds-content.model';

@Component({
    selector: 'gn-dark-theme-winning-rounds',
    templateUrl: './dark-theme-winning-rounds.component.html',
    styleUrl: './dark-theme-winning-rounds.component.scss',
})
export class DarkThemeWinningRoundsComponent implements OnChanges {
    @Input() matchData: BoxingCdsContent;
    multiMarket: MultiMarket = new MultiMarket();
    nameLength = SelectionNameLength.Seventeen;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as BoxingCdsContent;
        this.multiMarket.title = marketDetails?.content?.contentParameters?.RoundGroupBetting ?? '';
        this.multiMarket.selections = marketDetails?.roundGroupBetting?.selections;
        this.multiMarket?.selections?.forEach((selection) => {
            selection.selectionTitle = selection?.name?.replace('-', ' - ');
        });
    }
    constructor() {}
}
