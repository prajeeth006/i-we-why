import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RouteDataService } from '../../../common/services/route-data.service';
import { GreyhoundRacingContentService } from '../greyhound-racing-template/services/greyhound-racing-content.service';
import { GreyhoundStaticContent } from '../../models/greyhound-racing-template.model';
import { AntiPostService } from 'src/app/common/services/ante-post.service';
import { AntePostResult } from 'src/app/common/models/ante-post.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-ante-post',
  templateUrl: './ante-post.component.html',
  styleUrls: ['./ante-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.None
})
export class GreyHoundRacingAntePostComponent {
  private eventId: string;
  private marketId: string;
  nameLength = SelectionNameLength.Eighteen;
  errorMessage$ = this.antiPostService.errorMessage$;

  antePostResult$ = this.antiPostService.data$
    .pipe(
      tap((result: AntePostResult) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  greyHoundData$ = this.greyhoundRacingContentService.data$
    .pipe(
      tap((greyHoundData: GreyhoundStaticContent) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest(
    [
      this.antePostResult$,
      this.greyHoundData$
    ]
  ).pipe(
    map(([antiPostResult, greyHoundData]) => {
      return this.prepareResult(antiPostResult, greyHoundData);
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  prepareResult(antiPostResult: AntePostResult, greyHoundData: GreyhoundStaticContent){
    if(!antiPostResult)
      return antiPostResult;
    antiPostResult.racingContent = greyHoundData;
    antiPostResult.selections = antiPostResult.selections?.filter(selection => {
      selection.price = selection.hidePrice ? " " : selection.price;
      return !selection.hideEntry;;
    }) ?? [];
    return antiPostResult;
  }

  constructor(
    private routeDataService: RouteDataService,
    private greyhoundRacingContentService: GreyhoundRacingContentService,
    private antiPostService: AntiPostService
  ) {
    this.greyhoundRacingContentService.setImageType(true);
    let queryParams = this.routeDataService.getQueryParams();
    this.eventId = queryParams['eventId'];
    this.marketId = queryParams['marketId'];
    antiPostService.setEventMarketsList(this.eventId, this.marketId);
  }

}
