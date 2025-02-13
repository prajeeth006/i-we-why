import { Component, Input } from '@angular/core';

import { SelectionNameLength } from '../../../../../../app/common/models/general-codes-model';
import { DarkThemeCommonMatches } from '../../models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-common-market',
    templateUrl: './dark-theme-common-market-matches.component.html',
    styleUrls: ['./dark-theme-common-market-matches.component.scss'],
})
export class DarkThemeCommonMarketComponent {
    @Input() selectionData: DarkThemeCommonMatches;
    nameLength = SelectionNameLength.Seventeen;
}
