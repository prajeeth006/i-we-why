import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { RouteDataService } from '../../../common/services/route-data.service';
import { HorseRacingTemplateResult } from '../../models/horse-racing-template.model';
import { HorseRacingTemplateService } from './services/horse-racing-template.service';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'gn-horse-racing-template',
  templateUrl: './horse-racing-template.component.html',
  styleUrls: ['./horse-racing-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.None
})
export class HorseRacingTemplateComponent {
  errorMessage$ = this.horseRacingTemplateService.errorMessage$;

  vm$ = this.horseRacingTemplateService.data$
    .pipe(
      tap((horseRacingTemplateResult: HorseRacingTemplateResult) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(
    private horseRacingTemplateService: HorseRacingTemplateService,
    private routeDataService: RouteDataService,
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.horseRacingTemplateService.setEvenKeyAndMarketKeys(eventId, marketIds);
  }
}
