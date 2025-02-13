import { Injectable } from "@angular/core";
import { catchError, combineLatest, EMPTY, map, tap } from "rxjs";
import { JsonStringifyHelper } from "src/app/common/helpers/json-stringify.helper";
import { QueryParamEvent } from "src/app/common/models/query-param.model";
import { HorseRacingContent } from "src/app/horse-racing/models/horseracing-content.model";
import { HorseRacingContentService } from "src/app/horse-racing/services/horseracing-content.service";
import { Label, RunningOnTotalsContent, RunningResultContent, RunningResultMap } from "../models/running-on-totals.model";
import { RunningOnTotalsApiService } from "./data-feed/running-on-totals-api.service";
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { ErrorService } from "src/app/common/services/error.service";


@Injectable({
  providedIn: 'root'
})
export class RunningOnTotalsService {
  errorMessage$ = this.errorService.errorMessage$;

  runningOnTotalsResult$ = this.runningOnTotalsApiService.data$
    .pipe(
      tap((runningResultMap: RunningResultMap) => {
        this.errorService.isStaleDataAvailable = true;
        JSON.stringify(runningResultMap, JsonStringifyHelper.replacer);
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => JSON.stringify(horseRacingContent, JsonStringifyHelper.replacer)),
      catchError(err => {
        return EMPTY;
      })
    );

  data$ = combineLatest(
    [
      this.runningOnTotalsResult$,
      this.horseRacingContent$
    ]
  ).pipe(
    map(([runningOnTotalsResult, horseRacingContent]) => {
      let runningOnTotalsContent: RunningOnTotalsContent = new RunningOnTotalsContent();
      runningOnTotalsResult.types.forEach((value: RunningResultContent) => {
        runningOnTotalsContent.typeDetails.push(value.runningOnTotals);
        value.runningOnTotals.selectionName = StringHelper.removeAllPipeSymbols(value.runningOnTotals.selectionName);
        value.runningOnTotals.rpCourseName = StringHelper.removeAllPipeSymbols(value.runningOnTotals.rpCourseName);
      });

      runningOnTotalsContent?.typeDetails.sort((a, b) => {
        if (!!a.raceDateTime && !!b.raceDateTime) {
          return a.raceDateTime < b.raceDateTime ? -1 : 1
        } else {
          return a.rpCourseName < b.rpCourseName ? -1 : 1
        }
      })

      runningOnTotalsContent.horseRacingContent = horseRacingContent;
      runningOnTotalsContent.distanceAfterRace = Label.DISTANCEAFTERRACE;
      return runningOnTotalsContent;
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  setTypeId(typeId: QueryParamEvent) {
    this.runningOnTotalsApiService.setTypeId(typeId);
  }

  constructor(
    private runningOnTotalsApiService: RunningOnTotalsApiService,
    private horseRacingContent: HorseRacingContentService,
    private errorService: ErrorService
  ) {

  }
}
