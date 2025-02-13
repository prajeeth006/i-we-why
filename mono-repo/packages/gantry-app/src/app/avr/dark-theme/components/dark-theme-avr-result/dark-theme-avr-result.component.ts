import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EMPTY, catchError, tap } from 'rxjs';

import { AvrEventTypeEnum } from '../../../../avr/models/avr-result-enum.model';
import { AvrTemplate } from '../../../../avr/models/avr-template.model';
import { JsonStringifyHelper } from '../../../../common/helpers/json-stringify.helper';
import { FavouriteTags } from '../../../../common/models/racing-tags.model';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { AvrResultService } from '../../../services/avr-result.service';

@Component({
    selector: 'gn-dark-theme-avr-result',
    templateUrl: './dark-theme-avr-result.component.html',
    styleUrl: './dark-theme-avr-result.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkThemeAvrResultComponent {
    favouriteTags = FavouriteTags;
    errorMessage$ = this.avrResultPageService.errorMessage$;
    fillerPageMessage$ = this.avrResultPageService.fillerPageMessage$;
    isHorseRace = AvrEventTypeEnum.HorseRace;
    isMotorRace = AvrEventTypeEnum.MotorRace;
    isDogRace = AvrEventTypeEnum.DogRace;

    pageWrapperClass: string;
    tableWrapperClass: string;

    vm$ = this.avrResultPageService.data$.pipe(
        tap((result: AvrTemplate) => {
            this.setWrapperClasses(result.avrEventType);

            JSON.stringify(result, JsonStringifyHelper.replacer);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    private setWrapperClasses(eventType: string) {
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                this.pageWrapperClass = 'avr-template-wrapper avr-horse-racing-result avr-result-template';
                this.tableWrapperClass = 'horse-table';
                break;
            case AvrEventTypeEnum.DogRace:
                this.pageWrapperClass = 'avr-template-wrapper avr-dog-racing-result avr-result-template';
                this.tableWrapperClass = 'greyhound-table';
                break;
            case AvrEventTypeEnum.MotorRace:
                this.pageWrapperClass = 'avr-template-wrapper avr-motor-racing-result avr-result-template';
                this.tableWrapperClass = 'motor-race-table';
                break;
        }
    }

    constructor(
        private avrResultPageService: AvrResultService,
        private routeDataService: RouteDataService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const controllerId = queryParams['controllerId'];
        this.avrResultPageService.setControllerId(controllerId);
    }
}
