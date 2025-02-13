import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { RouteDataService } from '../../../../common/services/route-data.service';
import { DarkThemeHorseRacingService } from './services/dark-theme-horse-racing.service';

@Component({
    selector: 'gn-dark-theme-horse-racing',
    templateUrl: './dark-theme-horse-racing.component.html',
    styleUrls: ['./dark-theme-horse-racing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeHorseRacingComponent {
    errorMessage$ = this.darkThemeHorseRacingService.errorMessage$;

    vm$ = this.darkThemeHorseRacingService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private darkThemeHorseRacingService: DarkThemeHorseRacingService,
        private routeDataService: RouteDataService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const eventId = queryParams['eventId'];
        const marketIds = queryParams['marketIds'];
        this.darkThemeHorseRacingService.setEvenKeyAndMarketKeys(eventId, marketIds);
    }
}
