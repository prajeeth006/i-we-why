import { Component, Input } from '@angular/core';

import { ResultDetails } from '../../../../avr/models/avr-template.model';

@Component({
    selector: 'gn-dark-theme-avr-preamble-dog',
    templateUrl: './dark-theme-avr-preamble-dog.component.html',
    styleUrl: './dark-theme-avr-preamble-dog.component.scss',
})
export class DarkThemeAvrPreambleDogComponent {
    @Input() avrRunnersList: ResultDetails[];
    @Input() tableWrapperClass: string;

    constructor() {}
}
