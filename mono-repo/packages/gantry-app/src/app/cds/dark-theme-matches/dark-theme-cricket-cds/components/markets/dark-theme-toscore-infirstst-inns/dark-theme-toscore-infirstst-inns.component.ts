import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { CricketCdsTemplateResult } from '../../../../../../../app/cds/matches/cricket-cds/models/cricket-cds-template.model';
import { MultiMarket } from '../../../../../../../app/common/models/multimarket-selection';

@Component({
    selector: 'gn-dark-toscore-infirstst-inns',
    templateUrl: './dark-theme-toscore-infirstst-inns.component.html',
    styleUrls: ['./dark-theme-toscore-infirstst-inns.component.scss'],
})
export class DarkThemeToscoreInfirststInnsComponent implements OnChanges {
    @Input() matchData: CricketCdsTemplateResult;
    multiMarket: MultiMarket = new MultiMarket();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as CricketCdsTemplateResult;
        if (marketDetails) {
            this.multiMarket.title = marketDetails?.content?.contentParameters?.ToScore100in1stInning ?? '';
            this.multiMarket.selections = [];
            const rightItemsLength =
                marketDetails?.topScore100List && marketDetails?.topScore100List?.length >= 10
                    ? 5
                    : Math.ceil(marketDetails?.topScore100List?.length / 2);

            for (let i = 0; i < rightItemsLength; i++) {
                this.multiMarket.selections.push({
                    homePrice: marketDetails?.topScore100List[i]?.betOdds,
                    homeSelectionTitle: marketDetails?.topScore100List[i]?.betName,
                    awayPrice: marketDetails?.topScore100List[rightItemsLength + i]?.betOdds,
                    awaySelectionTitle: marketDetails?.topScore100List[rightItemsLength + i]?.betName,
                });
            }
        }
    }

    constructor() {}
}
