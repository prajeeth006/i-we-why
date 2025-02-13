import { Component } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { SnookerContent } from '../../models/snooker.model';
import { SnookerService } from '../../services/snooker.service';

@Component({
  selector: 'gn-snooker-template',
  templateUrl: './snooker-template.component.html',
  styleUrls: ['./snooker-template.component.scss']
})
export class SnookerTemplateComponent {

  constructor(private routeDataService: RouteDataService,
    private snookerService: SnookerService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.snookerService.setEvenKeyAndMarketKeys(eventId, marketIds);
  }

  errorMessage$ = this.snookerService.errorMessage$;

  vm$ = this.snookerService.data$
    .pipe(
      tap((snookerContent: SnookerContent) => {
        JSON.stringify(snookerContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

}
