import { Component } from '@angular/core';

import { EMPTY, catchError, tap } from 'rxjs';

import { AvrStates } from '../../../../avr/models/avr-states';
import { JsonStringifyHelper } from '../../../../common/helpers/json-stringify.helper';
import { ErrorService } from '../../../../common/services/error.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { AvrService } from '../../../services/avr.service';

@Component({
    selector: 'gn-dark-theme-avr',
    templateUrl: './dark-theme-avr.component.html',
    styleUrls: ['./dark-theme-avr.component.scss'],
})
export class DarkThemeAvrComponent {
    avrStates: typeof AvrStates = AvrStates;

    avrState$ = this.avrService.avrState$;
    fillerPageMessage$ = this.avrService.fillerPageMessage$;
    errorMessage$ = this.errorService.errorMessage$;

    vm$ = this.avrService.avr$.pipe(
        tap((result: any) => {
            JSON.stringify(result, JsonStringifyHelper.replacer);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private avrService: AvrService,
        private routeDataService: RouteDataService,
        private errorService: ErrorService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const controllerId = queryParams['controllerId'];
        this.avrService.setControllerId(controllerId);
    }
}
