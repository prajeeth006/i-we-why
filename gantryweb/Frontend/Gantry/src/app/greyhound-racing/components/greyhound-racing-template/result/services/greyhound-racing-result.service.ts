import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RunnerDetailsRacingEvent } from 'src/app/common/helpers/runner-details-racing-event.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { MeetingResultContent, MeetingResultMap, ResultSelection } from 'src/app/common/models/data-feed/meeting-results.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { EventResultService } from 'src/app/common/services/data-feed/event-result-service/event-result.service';
import { EachwayPositionsService } from 'src/app/common/services/eachway-positions.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { VirtualRaceImageService } from 'src/app/common/services/virtual-race-image.service';
import { GreyhoundRacingResultPage, GreyhoundResultEntry, GreyhoundStaticContent } from 'src/app/greyhound-racing/models/greyhound-racing-template.model';
import { RunnerReserve } from 'src/app/greyhound-racing/models/greyhound-racing.enum';
import { RacingContentGreyhoundResult } from 'src/app/greyhound-racing/models/racing-content.model';
import { RacingContentGreyhoundService } from 'src/app/greyhound-racing/services/data-feed/racing-content-greyhound.service';
import { GreyhoundRacingContentService } from '../../services/greyhound-racing-content.service';
import { RunnerType } from 'src/app/common/models/racing-tags.model';

@Injectable({
  providedIn: 'root'
})
export class GreyhoundRacingResultService {
  meetingName: string = "";
  isVirtualRaceFlag: boolean;

  errorMessage$ = this.errorService.errorMessage$;

  eventResult$ = this.eventResultService.data$
    .pipe(
      tap((meetingResultMap: MeetingResultMap) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  greyHoundData$ = this.greyhoundRacingContentService.data$
    .pipe(
      tap((greyHoundData: GreyhoundStaticContent) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  racingContent$ = this.racingContentGreyhoundService.data$
    .pipe(
      tap((racingContent: RacingContentGreyhoundResult) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
    catchError(err => {
      this.virtualRaceImageService.logError(err);
      return EMPTY;
    })
  );

  data$ = combineLatest([
    this.racingContent$,
    this.greyHoundData$,
    this.eventResult$,
    this.virtualRaceImageService$
  ])
    .pipe(
      map(([racingContent, greyHoundData, eventResult, virtualRaceSilkImageContent]) => {
        if (this.isVirtualRaceFlag && !!virtualRaceSilkImageContent) {
          greyHoundData.greyHoundImages = virtualRaceSilkImageContent;
        }
        const greyhoundRacingResultPage: GreyhoundRacingResultPage =
          this.createGreyhoundRacingResultPage(racingContent, greyHoundData, eventResult);
        return greyhoundRacingResultPage;
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private eventResultService: EventResultService,
    private racingContentGreyhoundService: RacingContentGreyhoundService,
    private greyhoundRacingContentService: GreyhoundRacingContentService,
    private errorService: ErrorService,
    private virtualRaceImageService: VirtualRaceImageService,
    private eachwayPositionsService: EachwayPositionsService) {
  }

  setEventId(eventId: QueryParamEvent) {
    this.eventResultService.setEventId(eventId);
  }

  createGreyhoundRacingResultPage(racingContent: RacingContentGreyhoundResult, greyhoundStaticContent: GreyhoundStaticContent, eventResult: MeetingResultMap): GreyhoundRacingResultPage {
    let greyhoundRacingResultPage = new GreyhoundRacingResultPage();
    greyhoundRacingResultPage.greyhoundStaticContent = greyhoundStaticContent
    eventResult?.types?.forEach((meetingResultContent: MeetingResultContent) => {
      greyhoundRacingResultPage.eventName = meetingResultContent.resultingContent?.eventName;
      greyhoundRacingResultPage.eventDateTime = meetingResultContent.resultingContent?.eventDateTime;
      greyhoundRacingResultPage.isVirtualEvent = this.isVirtualRaceFlag;

      greyhoundRacingResultPage.runnerCount = meetingResultContent.resultingContent?.runnerCount?.toString();
      greyhoundRacingResultPage.forecast = StringHelper.checkToteResults(meetingResultContent.resultingContent?.resultMarket?.foreCast);
      greyhoundRacingResultPage.tricast = StringHelper.checkToteResults(meetingResultContent.resultingContent?.resultMarket?.triCast);
      greyhoundRacingResultPage.eachWay = this.eachwayPositionsService.setEachWay(meetingResultContent.resultingContent?.resultMarket?.eachWays,
        greyhoundStaticContent?.contentParameters?.WinOnly, greyhoundStaticContent?.contentParameters?.Odds,
        greyhoundStaticContent?.contentParameters?.Places);
      greyhoundRacingResultPage.raceOff = this.setRaceOffTime(meetingResultContent.resultingContent?.raceOffTime, greyhoundStaticContent);
      greyhoundRacingResultPage = this.setRunnersAndNonRunners(meetingResultContent.resultingContent?.resultMarket?.listOfSelections, greyhoundRacingResultPage);
      greyhoundRacingResultPage.runners = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, meetingResultContent?.resultingContent?.resultMarket?.eachWays, greyhoundRacingResultPage.runners, meetingResultContent?.resultingContent?.resultMarket?.sortedTricast);
    });
    this.setPageStaticContent(racingContent, greyhoundStaticContent, greyhoundRacingResultPage);
    return greyhoundRacingResultPage;
  }

  private setRaceOffTime(raceOffTime: string, staticContent: GreyhoundStaticContent): string {
    if (!!raceOffTime) {
      let raceStage = raceOffTime.split("OFF:");
      if (raceStage.length > 1) {
        return staticContent?.contentParameters?.RaceOff + " @ " + raceStage[1];
      }
    }
  }

  private setRunnersAndNonRunners(selections: Array<ResultSelection>, greyhoundRacingResultPage: GreyhoundRacingResultPage): GreyhoundRacingResultPage {
    selections.forEach(selection => {
      let greyhoundDetails: GreyhoundResultEntry = new GreyhoundResultEntry();
      greyhoundDetails.position = selection.position;
      greyhoundDetails.runnerNumber = selection.runnerNumber?.toString();
      greyhoundDetails.greyhoundName = selection.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
      greyhoundDetails.price = selection?.startingPriceFraction?.endsWith('/1') ? selection?.startingPriceFraction?.substring(0, selection?.startingPriceFraction?.indexOf('/')) : selection?.startingPriceFraction;
      greyhoundDetails.jointFavourite = selection.favourite;
      greyhoundDetails.isJointFavourite = StringHelper.checkFavouriteTag(selection?.favourite);
      greyhoundDetails.isDeadHeat = !!selection.isDeadHeat;
      if (greyhoundDetails.greyhoundName.includes(RunnerReserve.Reserve)) {
        greyhoundDetails.isReserved = true;
        greyhoundDetails.greyhoundName = StringHelper.checkReserveRunner(greyhoundDetails.greyhoundName);
      }
      greyhoundDetails.greyhoundName = StringHelper.checkSelectionNameLengthAndTrimEnd(greyhoundDetails.greyhoundName, SelectionNameLength.Eighteen);

      if (!greyhoundDetails.greyhoundName.includes("N/R") && !!greyhoundDetails?.position) {
        greyhoundRacingResultPage.runners.push(greyhoundDetails);
      }
    });
    greyhoundRacingResultPage.runners?.sort((a, b) => Number(a.position) - Number(b.position) || Number(a.runnerNumber) - Number(b.runnerNumber));
    return greyhoundRacingResultPage;
  }

  private setPageStaticContent(racingContent: RacingContentGreyhoundResult, staticContent: GreyhoundStaticContent, greyhoundRacingResultPage: GreyhoundRacingResultPage) {

    greyhoundRacingResultPage.title = this.isVirtualRaceFlag ? staticContent?.contentParameters?.VirtualRacing : staticContent?.contentParameters?.Title;
    greyhoundRacingResultPage.forecastTitle = staticContent?.contentParameters?.Forecast;
    greyhoundRacingResultPage.tricastTitle = staticContent?.contentParameters?.Tricast;

    greyhoundRacingResultPage.runners.forEach(greyhound => {
      greyhound.trapImage = this.setGreyhoundTrapImages(greyhound.runnerNumber, staticContent);
      greyhound.deadHeat = staticContent?.contentParameters?.DeadHeat;
    });
    greyhoundRacingResultPage.raceNumber = racingContent.raceNo ? staticContent?.contentParameters?.Race + " " + racingContent?.raceNo : "";
    greyhoundRacingResultPage.distance = racingContent?.distance;
    greyhoundRacingResultPage.grade = racingContent?.grade;
  }

  private setGreyhoundTrapImages(runnerNo: string, staticContent: GreyhoundStaticContent): string {
    if (staticContent?.greyHoundImages?.runnerImages?.length >= (parseInt(runnerNo)) && parseInt(runnerNo) !== 0)
      return staticContent?.greyHoundImages?.runnerImages[parseInt(runnerNo) - 1]?.src;
  }

}