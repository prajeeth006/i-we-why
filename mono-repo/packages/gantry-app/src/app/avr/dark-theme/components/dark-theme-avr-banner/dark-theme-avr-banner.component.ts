import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
    selector: 'gn-dark-theme-avr-banner',
    templateUrl: './dark-theme-avr-banner.component.html',
    styleUrl: './dark-theme-avr-banner.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeAvrBannerComponent {
    @Input() racingImage: string | null;
    @Input() title: string | null;
    @Input() countDownValue$: Observable<string> | null;
    @Input() imageRight: string | null;
    @Input() isRaceOff: boolean = false;

    constructor() {}
}
