import { Component, Input } from '@angular/core';

import { ResultDetails } from '../../../models/avr-template.model';

// import { AVRRunners } from '../../../mocks/avr-runners.mock';

@Component({
    selector: 'gn-dark-theme-avr-preamble-motor',
    templateUrl: './dark-theme-avr-preamble-motor.component.html',
    styleUrl: './dark-theme-avr-preamble-motor.component.scss',
})
export class DarkThemeAvrPreambleMotorComponent {
    @Input() avrRunnersList: ResultDetails[];
    @Input() tableWrapperClass: string;

    constructor() {}

    // ngOnInit() {
    //     // to genrate Mock data for RunnersList
    //     this.avrRunnersList = new AVRRunners().generateRunnersList(11);
    // }
}
