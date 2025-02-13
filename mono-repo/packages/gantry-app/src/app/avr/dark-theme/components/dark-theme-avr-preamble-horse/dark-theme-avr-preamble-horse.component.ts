import { Component, Input, OnInit } from '@angular/core';

import { ResultDetails } from '../../../../avr/models/avr-template.model';

// import { AVRRunners } from '../../../mocks/avr-runners.mock';

@Component({
    selector: 'gn-dark-theme-avr-preamble-horse',
    templateUrl: './dark-theme-avr-preamble-horse.component.html',
    styleUrl: './dark-theme-avr-preamble-horse.component.scss',
})
export class DarkThemeAvrPreambleHorseComponent implements OnInit {
    @Input() avrRunnersList: ResultDetails[];
    @Input() tableWrapperClass: string;
    layoutClass: string;

    constructor() {}

    ngOnInit() {
        this.layoutClass = this.prepareLayout();
    }

    private prepareLayout(): string {
        /**
         * TODO: generate mock date of HorseRunners
         * * uncomment this line `this.avrRunnersList = new AVRRunners().generateRunnersList(11);`
         */
        //this.avrRunnersList = new AVRRunners().generateRunnersList(11);
        const runnersCount = this.avrRunnersList?.length;
        if (runnersCount >= 7 && runnersCount <= 8) {
            return 'selection-number-8';
        } else if (runnersCount >= 9 && runnersCount <= 10) {
            return 'selection-number-10';
        } else if (runnersCount >= 11 && runnersCount <= 12) {
            return 'selection-number-12';
        } else if (runnersCount >= 13 && runnersCount <= 16) {
            return 'selection-number-16';
        }
        return 'selection-number-8';
    }
}
