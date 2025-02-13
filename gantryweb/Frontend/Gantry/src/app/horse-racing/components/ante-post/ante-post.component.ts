import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RouteDataService } from '../../../common/services/route-data.service';
import { HorseRacingContentService } from '../../services/horseracing-content.service';
import { AntiPostService } from 'src/app/common/services/ante-post.service';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { AntePostResult } from 'src/app/common/models/ante-post.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-ante-post',
  templateUrl: './ante-post.component.html',
  styleUrls: ['./ante-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.None
})
export class HorseRacingAntePostComponent {
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

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => {}),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest(
    [
      this.antePostResult$,
      this.horseRacingContent$
    ]
  ).pipe(
    map(([antiPostResult, horseRacingContent]) => {
      return this.prepareResult(antiPostResult, horseRacingContent);      
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  prepareResult(antiPostResult: AntePostResult, horseRacingContent: HorseRacingContent){
    if(!antiPostResult)
      return antiPostResult;
    antiPostResult.racingContent = horseRacingContent;
    antiPostResult.selections = antiPostResult.selections?.filter(selection => {
      selection.price = selection.hidePrice ? " " : selection.price;
      return !selection.hideEntry;
    }) ?? [];
    return antiPostResult;
  }

  constructor(
    private routeDataService: RouteDataService,
    private horseRacingContent: HorseRacingContentService,
    private antiPostService: AntiPostService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    this.eventId = queryParams['eventId'];
    this.marketId = queryParams['marketId'];
    antiPostService.setEventMarketsList(this.eventId, this.marketId);
  }
}
