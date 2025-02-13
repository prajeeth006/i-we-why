import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'gn-dark-theme-header-full',
    templateUrl: './dark-theme-header-full.component.html',
    styleUrls: ['./dark-theme-header-full.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeHeaderFullComponent {
    @Input() title?: string;
    @Input() racingImage?: string | null;
    @Input() isFrom?: any;
    isLadbrokes = false;

    constructor() {}
}
