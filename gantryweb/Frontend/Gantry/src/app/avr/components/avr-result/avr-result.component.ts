import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { AvrResultService } from '../../services/avr-result.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { AvrTemplate } from '../../models/avr-template.model';
import { AvrEventTypeEnum } from '../../models/avr-result-enum.model';

@Component({
  selector: 'gn-avr-result',
  templateUrl: './avr-result.component.html',
  styleUrls: ['./avr-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized),
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AvrResultComponent {

  errorMessage$ = this.avrResultPageService.errorMessage$;
  fillerPageMessage$ = this.avrResultPageService.fillerPageMessage$;
  isHorseRace = AvrEventTypeEnum.HorseRace;
  isMotorRace = AvrEventTypeEnum.MotorRace;

  vm$ = this.avrResultPageService.data$.pipe(
    tap((result: AvrTemplate) => {
      JSON.stringify(result, JsonStringifyHelper.replacer);
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  constructor(
    private avrResultPageService: AvrResultService,
    private routeDataService: RouteDataService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let controllerId = queryParams['controllerId'];
    this.avrResultPageService.setControllerId(controllerId);
  }
}
