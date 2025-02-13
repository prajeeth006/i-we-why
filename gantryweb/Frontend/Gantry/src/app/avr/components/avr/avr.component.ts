import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvrStates } from '../../models/avr-states';
import { AvrService } from '../../services/avr.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { ErrorService } from 'src/app/common/services/error.service';

@Component({
  selector: 'gn-avr',
  templateUrl: './avr.component.html',
  styleUrls: ['./avr.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvrComponent {

  avrStates: typeof AvrStates = AvrStates;
  avrState$ = this.avrService.avrState$;
  fillerPageMessage$ = this.avrService.fillerPageMessage$;
  errorMessage$ = this.errorService.errorMessage$;

  vm$ = this.avrService.avr$.pipe(
    tap((result: any) => {
      JSON.stringify(result, JsonStringifyHelper.replacer);
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  constructor(private avrService: AvrService,
    private routeDataService: RouteDataService,
    private errorService: ErrorService) {
    let queryParams = this.routeDataService.getQueryParams();
    let controllerId = queryParams['controllerId'];
    this.avrService.setControllerId(controllerId);
  }
}
