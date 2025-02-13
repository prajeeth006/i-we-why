import { Component, Input } from '@angular/core';

import { SelectionNameLength } from '../../../../../../app/common/models/general-codes-model';
import { MultiMarket } from '../../../../../../app/common/models/multimarket-selection';

@Component({
    selector: 'gn-dark-common-market-records',
    templateUrl: './dark-theme-common-market-records.component.html',
    styleUrls: ['./dark-theme-common-market-records.component.scss'],
})
export class DarkThemeCommonMarketRecordComponent {
    @Input() multiMarket: MultiMarket;
    nameLength = SelectionNameLength.Seventeen;
}
