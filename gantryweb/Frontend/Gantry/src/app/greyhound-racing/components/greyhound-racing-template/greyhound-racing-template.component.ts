import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouteDataService } from '../../../common/services/route-data.service';
import { GreyhoundRacingTemplateResult } from 'src/app/greyhound-racing/models/greyhound-racing-template.model';
import { GreyhoundRacingTemplateService } from 'src/app/greyhound-racing/components/greyhound-racing-template/services/greyhound-racing-template.service';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'gn-greyhound-racing-template',
  templateUrl: './greyhound-racing-template.component.html',
  styleUrls: ['./greyhound-racing-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // reacts only on observable change (not normal property change - more optimized)
})
export class GreyhoundRacingTemplateComponent {
  errorMessage$ = this.greyhoundRacingTemplateService.errorMessage$;

  vm$ = this.greyhoundRacingTemplateService.data$
    .pipe(
      tap((greyhoundRacingTemplateResult: GreyhoundRacingTemplateResult) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );


  constructor(private greyhoundRacingTemplateService: GreyhoundRacingTemplateService,
    private routeDataService: RouteDataService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.greyhoundRacingTemplateService.setEventKeyAndMarketKeys(eventId, marketIds);
  }
}
