import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { Formula1TemplateContent } from '../../model/formula1-template.model';
import { FormulaTemplateService } from '../../services/formula-template.service';

@Component({
  selector: 'gn-formula1template',
  templateUrl: './formula1template.component.html',
  styleUrls: ['./formula1template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom

})
export class Formula1templateComponent {
  nameLength = SelectionNameLength.Seventeen;
  errorMessage$ = this.formula1Service.errorMessage$;

  vm$ = this.formula1Service.data$
    .pipe(
      tap((formula1TempContent: Formula1TemplateContent) => {
        JSON.stringify(formula1TempContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private routeDataService: RouteDataService,
    private formula1Service: FormulaTemplateService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.formula1Service.setEvenKeyAndMarketKeys(eventId, marketIds);
  }
}
