import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { BoxingCdsContent, MultiMarket } from '../../../../matches/boxing-cds/models/boxing-cds-content.model';

@Component({
    selector: 'gn-dark-theme-method-of-victory',
    templateUrl: './dark-theme-method-of-victory.component.html',
    styleUrl: './dark-theme-method-of-victory.component.scss',
})
export class DarkThemeMethodOfVictoryComponent implements OnChanges {
    @Input() matchData: BoxingCdsContent;
    multiMarket: MultiMarket = new MultiMarket();
    nameLength = SelectionNameLength.Seventeen;
    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as BoxingCdsContent;
        this.multiMarket.title = marketDetails?.content?.contentParameters?.MethodOfVictory ?? '';
        this.multiMarket.trimValue = false;
        // Filter out selections with empty homePrice and awayPrice
        this.multiMarket.selections = marketDetails?.methodOfVictory?.selections?.filter(
            (selection) => selection?.homePrice !== '' || selection?.awayPrice !== '',
        );
        this.multiMarket?.selections?.forEach((selection) => {
            selection.selectionTitle = selection?.name;
        });
    }
}
