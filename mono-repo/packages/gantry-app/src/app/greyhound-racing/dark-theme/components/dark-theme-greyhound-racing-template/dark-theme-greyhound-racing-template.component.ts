import { Component } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { RouteDataService } from '../../../../common/services/route-data.service';
import { DarkThemeGreyhoundRacingTemplateService } from './services/dark-theme-greyhound-racing-template.service';

@Component({
    selector: 'gn-dark-theme-greyhound-racing-template',
    templateUrl: './dark-theme-greyhound-racing-template.component.html',
    styleUrls: ['./dark-theme-greyhound-racing-template.component.scss'],
})
export class DarkThemeGreyhoundRacingTemplateComponent {
    errorMessage$ = this.darkThemeGreyhoundRacingTemplateService.errorMessage$;

    constructor(
        private darkThemeGreyhoundRacingTemplateService: DarkThemeGreyhoundRacingTemplateService,
        private routeDataService: RouteDataService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const eventId = queryParams['eventId'];
        const marketIds = queryParams['marketIds'];
        this.darkThemeGreyhoundRacingTemplateService.setEventKeyAndMarketKeys(eventId, marketIds);
    }

    vm$ = this.darkThemeGreyhoundRacingTemplateService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );
}
