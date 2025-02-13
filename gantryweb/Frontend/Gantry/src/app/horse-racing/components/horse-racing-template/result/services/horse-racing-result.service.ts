import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RunnerDetailsRacingEvent } from 'src/app/common/helpers/runner-details-racing-event.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { MeetingResultMap, MeetingResultContent, ResultSelection } from 'src/app/common/models/data-feed/meeting-results.model';
import { ImageStatus } from 'src/app/horse-racing/models/fallback-src.constant';
import { Addendum, SelectionNameLength, StewardType } from 'src/app/common/models/general-codes-model';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { BaseRacingTemplateService } from 'src/app/common/services/base-racing-template.service';
import { EventResultService } from 'src/app/common/services/data-feed/event-result-service/event-result.service';
import { EachwayPositionsService } from 'src/app/common/services/eachway-positions.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { EvrAvrConfigurationService } from 'src/app/common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { RaceOffService } from 'src/app/common/services/race-off.service';
import { VirtualRaceImageService } from 'src/app/common/services/virtual-race-image.service';
import { RacingContentResult } from 'src/app/horse-racing/models/data-feed/racing-content.model';
import { HorseRacingResultDetails, Totes } from 'src/app/horse-racing/models/horse-racing-meeting-results.model';
import { HorseRacingResultPage, RunnerImages } from 'src/app/horse-racing/models/horse-racing-template.model';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';
import { HorseRacing } from 'src/app/horse-racing/models/hose-racing-common.enum';
import { RacingContentService } from 'src/app/horse-racing/services/data-feed/racing-content.service';
import { HorseRacingContentService } from 'src/app/horse-racing/services/horseracing-content.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { RunnerType } from 'src/app/common/models/racing-tags.model';

@Injectable({
  providedIn: 'root'
})
export class HorseRacingResultService extends BaseRacingTemplateService {

  private meetingList: Array<string> = [];
  isVirtualRaceFlag: boolean;
  private virtualRaceSilkImages: RunnerImages = null;
  private virtualRaceSubject = new BehaviorSubject<RunnerImages>(null);
  meetingName: string = "";
  DividendText: string;

  errorMessage$ = this.errorService.errorMessage$;

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => {
        this.DividendText = horseRacingContent?.contentParameters?.NotWon;
      }),
      catchError(err => {
        return EMPTY;
      })
    );


  eventResult$ = this.eventResultService.data$.pipe(
    map((eventResultMap: MeetingResultMap) => {
      return this.prepareEventResult(eventResultMap);
    }),
    tap((horseRacingResultPage: HorseRacingResultPage) => {
      this.errorService.isStaleDataAvailable = true;
      this.errorService.unSetError();
    }),
    catchError(err => {
      this.errorService.logError(err);
      return EMPTY;
    })
  );

  racingContent$ = this.racingContentService.data$
    .pipe(
      tap((racingContent: RacingContentResult) => {
      }),
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
    this.eventResult$,
    this.racingContent$,
    this.horseRacingContent$,
    this.virtualRaceImageService$
  ])
    .pipe(
      map(([eventResult, racingContent, horseRacingContent, virtualRaceSilkImageContent]) => {
        if (this.isVirtualRaceFlag && !!virtualRaceSilkImageContent) {
          this.virtualRaceSilkImages = virtualRaceSilkImageContent;
        }
        const horseRacingResultPage: HorseRacingResultPage =
          this.setEventResult(eventResult, racingContent, horseRacingContent);
        horseRacingResultPage.addendumMessage = horseRacingContent?.contentParameters[horseRacingResultPage.addendumMessageKey];

        if (racingContent?.hasRacingContent !== undefined && !racingContent?.hasRacingContent) {
          horseRacingResultPage.runners.map(runner => {
            if (runner.jockeySilkImage === ImageStatus.Default) {
              runner.jockeySilkImage = ImageStatus.ImageNotPresent;
            }
          })
        }

        return horseRacingResultPage;
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private eventResultService: EventResultService,
    private horseRacingContent: HorseRacingContentService,
    private racingContentService: RacingContentService,
    private errorService: ErrorService,
    private virtualRaceImageService: VirtualRaceImageService,
    evrAvrConfigurationService: EvrAvrConfigurationService,
    gantryCommonContentService: GantryCommonContentService,
    private eachwayPositionsService: EachwayPositionsService,
    public raceOffService: RaceOffService,
    public gantryMarketsService: GantryMarketsService) {
    super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
  }

  prepareEventResult(eventResultMap: MeetingResultMap): HorseRacingResultPage {
    let resultingContent: MeetingResultContent = new MeetingResultContent();
    eventResultMap?.types?.forEach((value: MeetingResultContent) => {
      resultingContent = value;
    });
    return this.setHorseRacingEventResultsTemplate(resultingContent);
  }

  private setHorseRacingEventResultsTemplate(resultingContent: MeetingResultContent): HorseRacingResultPage {
    let horseRacingeventResults: HorseRacingResultPage = new HorseRacingResultPage();

    horseRacingeventResults.eventName = resultingContent.resultingContent?.eventName;
    horseRacingeventResults.eventDateTime = resultingContent.resultingContent?.eventDateTime;
    let eventName = resultingContent.resultingContent?.eventName?.toUpperCase();
    if (this.isVirtualRaceFlag) {
      if (!this.meetingList?.includes(this.meetingName)) {
        this.meetingList.push(this.meetingName);
        this.virtualRaceImageService.setEventAndMeetingName("0", this.meetingName, eventName);
        this.virtualRaceImageService$.subscribe((runnerImageContent) => {
          this.virtualRaceSubject.next(runnerImageContent);
        });
      }
    }

    horseRacingeventResults.raceOffTime = this.setRaceOffTime(resultingContent?.resultingContent?.raceOffTime);
    horseRacingeventResults.eventTime = resultingContent?.resultingContent?.eventTime;
    horseRacingeventResults.eachWays = resultingContent?.resultingContent?.resultMarket?.eachWays;
    horseRacingeventResults.runnerCount = resultingContent?.resultingContent?.runnerCount?.toString();
    horseRacingeventResults.foreCast = StringHelper.checkToteResults(resultingContent?.resultingContent?.resultMarket?.foreCast);
    horseRacingeventResults.triCast = StringHelper.checkToteResults(resultingContent?.resultingContent?.resultMarket?.triCast);
    horseRacingeventResults.win = StringHelper.checkToteResults(resultingContent?.resultingContent?.resultMarket?.win);
    horseRacingeventResults.place = resultingContent?.resultingContent?.resultMarket?.place;
    horseRacingeventResults.placeDividends = RunnerDetailsRacingEvent.setPlaceDividends(resultingContent?.resultingContent?.resultMarket?.placeDividends);
    horseRacingeventResults.totes = new Totes();
    horseRacingeventResults.totes.exacta = StringHelper.checkToteDividendResults(resultingContent?.resultingContent?.resultMarket?.exacta, this.DividendText);
    horseRacingeventResults.totes.trifecta = (!!resultingContent?.resultingContent?.resultMarket?.triCast && resultingContent.resultingContent?.resultMarket?.triCast != 'null')
      ? StringHelper.checkToteDividendResults(resultingContent?.resultingContent?.resultMarket?.trifecta, this.DividendText) : '';
    horseRacingeventResults = this.setEventRunners(resultingContent?.resultingContent?.resultMarket?.listOfSelections, horseRacingeventResults);
    horseRacingeventResults.runners = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, resultingContent?.resultingContent?.resultMarket?.eachWays, horseRacingeventResults.runners, resultingContent?.resultingContent?.resultMarket?.sortedTricast);
    horseRacingeventResults.isResultAmended = resultingContent.resultingContent?.isResultAmended;
    horseRacingeventResults = this.getaddendumMessageKey(resultingContent, horseRacingeventResults);
    return horseRacingeventResults;
  }

  private setEventRunners(selections: Array<ResultSelection>, horseRacingResultPage: HorseRacingResultPage): HorseRacingResultPage {
    const nonRunnerList: Number[] = [];
    selections?.forEach(selection => {
      let horseDetails: HorseRacingResultDetails = new HorseRacingResultDetails();
      horseDetails.position = selection.position;
      horseDetails.horseName = selection.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
      horseDetails.horseRunnerNumber = selection.runnerNumber?.toString();

      if (horseDetails.horseName?.includes(HorseRacing.Reserve)) {
        horseDetails.isReserved = true;
        horseDetails.horseName = StringHelper.checkReserveRunner(horseDetails.horseName);
      }
      if (SportBookSelectionHelper.isNonRunner(selection.selectionName)) {
        nonRunnerList.push(Number(horseDetails.horseRunnerNumber))
      }
      horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails.horseName, SelectionNameLength.Eighteen);
      horseDetails.favourite = selection.favourite;
      horseDetails.isFavourite = StringHelper.checkFavouriteTag(selection?.favourite);
      horseDetails.isDeadHeat = selection.isDeadHeat;
      horseDetails.price = selection?.startingPriceFraction?.endsWith('/1') ? selection?.startingPriceFraction?.substring(0, selection?.startingPriceFraction?.indexOf('/')) : selection?.startingPriceFraction;
      if (!!horseDetails.position) horseRacingResultPage.runners.push(horseDetails);

    });
    horseRacingResultPage.horseRaceNonRunnerList = this.showNonRunners(nonRunnerList);
    horseRacingResultPage.runners?.sort((a, b) => Number(a.position) - Number(b.position) || Number(a.horseRunnerNumber) - Number(b.horseRunnerNumber));
    return horseRacingResultPage;
  }

  showNonRunners(nonRunnerList: Array<Number>) {
    return nonRunnerList.sort((a: number, b: number) => a - b).join(', ');
  }

  getJockeySilkImage(imageUrl: string) {
    return !imageUrl ? ImageStatus.ImageNotPresent : imageUrl;
  }

  setEventResult(eventResult: HorseRacingResultPage, racingContent: RacingContentResult, horseRacingContent: HorseRacingContent): HorseRacingResultPage {
    eventResult.racingContent = racingContent;
    eventResult.horseRacingContent = horseRacingContent;
    eventResult.eachWayResult = this.eachwayPositionsService.setEachWay(eventResult.eachWays,
      horseRacingContent?.contentParameters?.WinOnly, horseRacingContent?.contentParameters?.Odds,
      horseRacingContent?.contentParameters?.PLACES);
    eventResult.isVirtualEvent = this.isVirtualRaceFlag;
    if (this.isVirtualRaceFlag) {
      if (!!this.virtualRaceSilkImages) {
        for (let eventRunnerList of eventResult?.runners) {
          eventRunnerList.jockeySilkImage = this.getJockeySilkImage(this.virtualRaceSilkImages?.runnerImages[Number(eventRunnerList?.horseRunnerNumber) - 1]?.src);
        }
      }
    }
    else {
      let horseRunners = eventResult.racingContent?.horses;
      if (horseRunners) {
        for (let eventRunnerList of eventResult?.runners) {
          let runnerNumber = eventResult.racingContent?.horses?.find(a => a?.saddle === eventRunnerList?.horseRunnerNumber);
          if (runnerNumber) {
            eventRunnerList.jockeySilkImage = this.getJockeySilkImage(runnerNumber.silkCoral);
          }
        }
      }
    }
    return eventResult;
  }

  public setEventId(eventId: string,) {
    this.eventResultService.setEventId(new QueryParamEvent(eventId));
  }

  private setRaceOffTime(raceOffTime: string): string {
    if (!!raceOffTime) {
      let raceStage = raceOffTime?.split("OFF:");
      if (raceStage?.length > 1) {
        return "OFF @ " + raceStage[1];
      }
    }
  }
  private getaddendumMessageKey(resultingContent: MeetingResultContent, horseRacingResultPage: HorseRacingResultPage): HorseRacingResultPage {
    horseRacingResultPage.addendumColor = '#ffffff';
    if (resultingContent.resultingContent?.isAbandonedRace) {
      horseRacingResultPage.addendumMessageKey = Addendum.raceAbandoned;
    }
    else if (resultingContent.resultingContent?.isVoidRace) {
      horseRacingResultPage.addendumMessageKey = Addendum.voidRace;
    }
    else if (resultingContent.resultingContent?.isStewardEnquiry && (resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_S || resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_R)) {
      horseRacingResultPage.addendumMessageKey = Addendum.stewardsEnquiry;
    }
    else if (resultingContent.resultingContent?.isStewardEnquiry && resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_V) {
      horseRacingResultPage.addendumMessageKey = Addendum.resultStands;
    }
    else if (resultingContent.resultingContent?.isStewardEnquiry && resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_Z) {
      horseRacingResultPage.addendumColor = '#FFCD00';
      horseRacingResultPage.addendumMessageKey = Addendum.amendedResult;
    }
    else if (resultingContent.resultingContent?.isPhotoFinish) {
      horseRacingResultPage.addendumMessageKey = Addendum.photo;
    }
    else if (!resultingContent.resultingContent?.isPhotoFinish && resultingContent.resultingContent?.isMarketResulted) {
      horseRacingResultPage.addendumMessageKey = '';
    }
    return horseRacingResultPage;
  }
}
