import { Component } from '@angular/core';

import { EMPTY, catchError, tap } from 'rxjs';

import { AvrEventTypeEnum } from '../../../../avr/models/avr-result-enum.model';
import { AvrTemplate, ResultDetails } from '../../../../avr/models/avr-template.model';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { AvrPreambleService } from '../../../services/avr-preamble.service';

@Component({
    selector: 'gn-dark-theme-avr-preamble',
    templateUrl: './dark-theme-avr-preamble.component.html',
    styleUrls: ['./dark-theme-avr-preamble.component.scss'],
})
export class DarkThemeAvrPreambleComponent {
    errorMessage$ = this.avrPreambleService.errorMessage$;
    fillerPageMessage$ = this.avrPreambleService.fillerPageMessage$;
    isHorseRace = AvrEventTypeEnum.HorseRace;
    isMotorRace = AvrEventTypeEnum.MotorRace;
    isDogRace = AvrEventTypeEnum.DogRace;
    pageWrapperClass: string;
    tableWrapperClass: string;

    avrRunnersList: Array<ResultDetails> = [];

    vm$ = this.avrPreambleService.data$.pipe(
        tap((result: AvrTemplate) => {
            this.setWrapperClasses(result.avrEventType);
            this.avrRunnersList = result.resultsTable;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    private setWrapperClasses(eventType: string) {
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                this.pageWrapperClass = 'avr-template-wrapper avr-horse-racing-preamble';
                this.tableWrapperClass = 'horse-table';
                break;
            case AvrEventTypeEnum.DogRace:
                this.pageWrapperClass = 'avr-template-wrapper avr-dog-racing-preamble';
                this.tableWrapperClass = 'greyhound-table';
                break;
            case AvrEventTypeEnum.MotorRace:
                this.pageWrapperClass = 'avr-template-wrapper avr-motor-racing-preamble';
                this.tableWrapperClass = 'motor-race-table';
                break;
        }
    }

    constructor(
        private avrPreambleService: AvrPreambleService,
        private routeDataService: RouteDataService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const controllerId = queryParams['controllerId'];
        this.avrPreambleService.setControllerId(controllerId);
    }
}
