import { Component, Input } from '@angular/core';

import { ToteDividend } from '../../models/general-codes-model';

@Component({
    selector: 'gn-dark-theme-footer',
    templateUrl: './dark-theme-footer.component.html',
    styleUrls: ['./dark-theme-footer.component.scss'],
})
export class DarkThemeFooterComponent {
    @Input() leftSideText: string;
    @Input() rightSideText: string | null;
    @Input() centerSideText: string | null;
    @Input() contentParameter: {
        [attr: string]: string;
    };
    @Input() placePot: string | null;
    @Input() quadPot: string | null;
    @Input() jackPot: string | null;
    @Input() extendedWidthToHalf: string;
    DividendValue = ToteDividend.DividendValue;

    jackPotIsNum = (jackPot: string) => {
        return Number(jackPot) ? true : false;
    };

    constructor() {}
}
