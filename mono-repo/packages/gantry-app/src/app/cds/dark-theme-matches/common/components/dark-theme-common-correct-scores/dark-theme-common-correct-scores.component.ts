import { Component, Input } from '@angular/core';

import { SelectionNameLength } from '../../../../../../app/common/models/general-codes-model';
import { MultiMarket } from '../../../../../../app/common/models/multimarket-selection';

@Component({
    selector: 'gn-dark-common-correct-scores',
    templateUrl: './dark-theme-common-correct-scores.component.html',
    styleUrls: ['./dark-theme-common-correct-scores.component.scss'],
})
export class DarkThemeCommonCorrectScoreComponent {
    @Input() multiMarket: MultiMarket;
    nameLength = SelectionNameLength.Seventeen;
}
