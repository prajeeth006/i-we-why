import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouteDataService } from '../../common/services/route-data.service';
import { CricketTemplateResult } from '../models/cricket-template.model';
import { CricketTemplateService } from '../services/cricket-template.service';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'gn-horse-racing-template',
  templateUrl: './cricket-template.component.html',
  styleUrls: ['./cricket-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CricketTemplateComponent {
  errorMessage$ = this.cricketTemplateService.errorMessage$;

  vm$ = this.cricketTemplateService.data$
    .pipe(
      tap((cricketTemplateResult: CricketTemplateResult) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(
    private cricketTemplateService: CricketTemplateService,
    private routeDataService: RouteDataService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.cricketTemplateService.setEventKeyAndMarketKeys(eventId, marketIds);
  }
}
