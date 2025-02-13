import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
    selector: 'gn-dark-theme-filler-page',
    templateUrl: './dark-theme-filler-page.component.html',
    styleUrl: './dark-theme-filler-page.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeFillerPageComponent {
    @Input() fillerPageMessage$: Observable<string>;
    @Input() pageName: string;

    constructor() {}
}
