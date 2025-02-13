import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { tap, catchError, EMPTY } from 'rxjs';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { HorseRacingTemplateResult } from '../../models/horse-racing-template.model';
import { DarkThemeHorseRacingService } from './services/dark-theme-horse-racing.service';

@Component({
  selector: 'gn-dark-theme-horse-racing',
  templateUrl: './dark-theme-horse-racing.component.html',
  styleUrls: ['./dark-theme-horse-racing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.None
})
export class DarkThemeHorseRacingComponent {
  errorMessage$ = this.darkThemeHorseRacingService.errorMessage$;

  vm$ = this.darkThemeHorseRacingService.data$
    .pipe(
      tap((horseRacingTemplateResult: HorseRacingTemplateResult) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(
    private darkThemeHorseRacingService: DarkThemeHorseRacingService,
    private routeDataService: RouteDataService,
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.darkThemeHorseRacingService.setEvenKeyAndMarketKeys(eventId, marketIds);
  }

}
