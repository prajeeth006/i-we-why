import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { RouteDataService } from '../../../../../common/services/route-data.service';
import { DarkThemeHorseRacingService } from '../services/dark-theme-horse-racing.service';

@Component({
    selector: 'gn-dark-theme-runner-count',
    templateUrl: './dark-theme-runner-count.component.html',
    styleUrl: './dark-theme-runner-count.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeRunnerCountComponent {
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
