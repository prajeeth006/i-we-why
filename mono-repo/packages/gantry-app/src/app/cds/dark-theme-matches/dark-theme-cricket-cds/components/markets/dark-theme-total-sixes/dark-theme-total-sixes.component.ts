import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { CricketCdsTemplateModel } from '../../../../../../../app/cds/common/models/cricket-cds-template.model';
import { MultiMarket } from '../../../../../../../app/common/models/multimarket-selection';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-total-sixes',
    templateUrl: './dark-theme-total-sixes.component.html',
    styleUrls: ['./dark-theme-total-sixes.component.scss'],
})
export class DarkThemeTotalSixesComponent implements OnChanges {
    @Input() matchData: CricketCdsTemplateModel;
    multiMarket: MultiMarket = new MultiMarket();
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as CricketCdsTemplateModel;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (!!marketDetails?.gameInfo?.markets?.totalSixes) {
            const market = marketDetails?.gameInfo?.markets?.totalSixes;
            if (!!market && !!market?.marketSelections) {
                let marketSelections = market?.marketSelections;
                this.selectionData.title = marketDetails?.content?.contentParameters?.TotalSixes ?? '';
                this.selectionData.marketVersesName = '';
                this.selectionData.homePrice = marketSelections?.home?.betOdds;
                this.selectionData.homeSelectionTitle = marketSelections?.home?.betName;
                this.selectionData.awayPrice = marketSelections?.away?.betOdds;
                this.selectionData.awaySelectionTitle = marketSelections?.away?.betName;
                this.selectionData.trimTitleRequired = true;
            }
        }
    }

    constructor() {}
}
