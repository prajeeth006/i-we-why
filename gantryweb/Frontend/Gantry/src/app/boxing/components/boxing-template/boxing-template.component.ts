import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { BoxingTemplateContent } from '../../models/boxing-template.model';
import { BoxingTemplateService } from '../../services/boxing-template.service';

@Component({
  selector: 'gn-boxing-template',
  templateUrl: './boxing-template.component.html',
  styleUrls: ['./boxing-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxingTemplateComponent {

  constructor(private routeDataService: RouteDataService,
    private boxingService: BoxingTemplateService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.boxingService.setEvenKeyAndMarketKeys(eventId, marketIds);
  }

  errorMessage$ = this.boxingService.errorMessage$;

  vm$ = this.boxingService.data$
    .pipe(
      tap((boxingTempContent: BoxingTemplateContent) => {
        JSON.stringify(boxingTempContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );
}
