import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'gn-dark-theme-header',
    templateUrl: './dark-theme-header.component.html',
    styleUrls: ['./dark-theme-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeHeaderComponent {
    @Input() title?: string;
    @Input() racingImage?: string | null;
    @Input() eventDateTime?: Date;
    @Input() isFrom?: any;
    @Input() result?: string;
    @Input() leadTitle?: string;
    // only for manual templates
    @Input() eventTime?: string;
    @Input() isPlus1MarketPresent = false;

    isLadbrokes = false;

    constructor() {}
}
