import { Component, Input } from '@angular/core';

@Component({
    selector: 'gn-dark-theme-avr-footer',
    templateUrl: './dark-theme-avr-footer.component.html',
    styleUrl: './dark-theme-avr-footer.component.scss',
})
export class DarkThemeAvrFooterComponent {
    @Input() isEventResulted: boolean;
    @Input() runnerCount: string;
    @Input() marketEachWayString: string;

    constructor() {}
}
