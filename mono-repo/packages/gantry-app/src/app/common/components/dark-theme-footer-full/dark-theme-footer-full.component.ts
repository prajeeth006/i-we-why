import { Component, Input } from '@angular/core';

@Component({
    selector: 'gn-dark-theme-footer-full',
    templateUrl: './dark-theme-footer-full.component.html',
    styleUrls: ['./dark-theme-footer-full.component.scss'],
})
export class DarkThemeFooterFullComponent {
    @Input() leftSideText: string;
    @Input() rightSideText: string | null;

    constructor() {}
}
