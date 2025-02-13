import { Component } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { AntePostResult } from 'src/app/common/models/ante-post.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { AntiPostService } from 'src/app/common/services/ante-post.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';

@Component({
  selector: 'gn-outright-template',
  templateUrl: './outright-template.component.html',
  styleUrls: ['./outright-template.component.scss']
})
export class OutrightTemplateComponent {

  private eventId: string;
  private marketId: string;
  nameLength = SelectionNameLength.Seventeen;
  errorMessage$ = this.antiPostService.errorMessage$;

  vm$ = this.antiPostService.data$
    .pipe(
      tap((result: AntePostResult) => {
       this.prepareResult(result);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

    constructor(
      private routeDataService: RouteDataService,
      private antiPostService: AntiPostService
    ) {
      let queryParams = this.routeDataService.getQueryParams();
      this.eventId = queryParams['eventId'];
      this.marketId = queryParams['marketId'];
      antiPostService.setEventMarketsList(this.eventId, this.marketId);
    }

    prepareResult(result: AntePostResult){
      if(result){
        result.selections = result.selections?.filter(selection => {
          selection.price  = selection.hidePrice ? " " : selection.price;
          return !selection.hideEntry;
        }) ?? [];
      }
    }
}
