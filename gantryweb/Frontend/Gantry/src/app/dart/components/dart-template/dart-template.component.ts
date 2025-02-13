import { Component } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { DartTemplateContent } from '../../models/dart-template.model';
import { DartTemplateService } from '../../services/dart-template.service';

@Component({
  selector: 'gn-dart-template',
  templateUrl: './dart-template.component.html',
  styleUrls: ['./dart-template.component.scss']
})
export class DartTemplateComponent {

  constructor(private routeDataService: RouteDataService,
    private dartTemplateService: DartTemplateService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.dartTemplateService.setEvenKeyAndMarketKeys(eventId, marketIds);
  }

  errorMessage$ = this.dartTemplateService.errorMessage$;

  vm$ = this.dartTemplateService.data$
    .pipe(
      tap((dartContent: DartTemplateContent) => {
        JSON.stringify(dartContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );


}
