import { Component, Input } from '@angular/core';

import { MultiMarket } from '../../../common/models/multimarket-selection';
import { SelectionNameLength } from '../../models/general-codes-model';

@Component({
    selector: 'gn-multimarket-home-selection-away',
    templateUrl: './multimarket-home-selection-away.component.html',
    styleUrls: ['./multimarket-home-selection-away.component.scss'],
})
export class MultimarketHomeSelectionAwayComponent {
    @Input() multiMarket: MultiMarket;
    @Input() iscorrect: string;
    nameLength = SelectionNameLength.Seventeen;

    constructor() {}
}
