import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { MultiMarket } from '../../../../../common/models/multimarket-selection';
import { Game, Selection, TennisCdsContent, TennisContentParams } from '../../../../matches/tennis/models/tennis-cds-content.model';
import { DarkThemeCommonMatches } from '../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-set-betting',
    templateUrl: './dark-theme-set-betting.component.html',
    styleUrl: './dark-theme-set-betting.component.scss',
})
export class DarkThemeSetBettingComponent implements OnChanges {
    @Input() matchData: TennisCdsContent;
    @Input() content: TennisContentParams;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();
    nameLength = SelectionNameLength.Seventeen;
    multiMarket: MultiMarket = new MultiMarket();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails: Game[] = change?.matchData?.currentValue as Game[];
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails && marketDetails?.length > 0) {
            const market: Game[] = marketDetails?.filter((item) => item?.isSetBetting === true);
            this.multiMarket.selections = [];
            if (market && market.length > 0) {
                this.multiMarket.title = this.content?.contentParameters?.SetBetting ?? '';
                const selections: Selection[] | undefined = market[0].setBetting;
                selections?.forEach((selection) => {
                    this.multiMarket?.selections?.push({
                        homePrice: selection?.homeBettingPrice,
                        selectionTitle: selection?.scorePoint?.replace('-', ' - '),
                        awayPrice: selection?.awayBettingPrice,
                    });
                });
            }
        }
    }
}
