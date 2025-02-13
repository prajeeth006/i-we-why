import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { catchError, EMPTY, tap } from "rxjs";
import { SelectionNameLength } from "src/app/common/models/general-codes-model";
import { RouteDataService } from "src/app/common/services/route-data.service";
import { TennisContent } from "../models/tennis.model";
import { TennisService } from "../services/tennis.service";

@Component({
  selector: 'gn-tennis',
  templateUrl: './tennis.component.html',
  styleUrls: ['./tennis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class TennisComponent {
  nameLength = SelectionNameLength.Seventeen;
  errorMessage$ = this.tennisService.errorMessage$;

  vm$ = this.tennisService.data$
    .pipe(
      tap((tennisContent: TennisContent) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private routeDataService: RouteDataService,
    private tennisService: TennisService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.tennisService.setEvenKeyAndMarketKeys(eventId, marketIds);
  }

}