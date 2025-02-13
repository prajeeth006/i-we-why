import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { SportBookResult } from '../../../../common/models/data-feed/sport-bet-models';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { GreyhoundRacingRunnersResult, GreyhoundRacingTemplateResult, GreyhoundStaticContent, RunnerImages } from '../../../models/greyhound-racing-template.model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../common/models/query-param.model';
import { SportBookResultHelper } from 'src/app/common/helpers/sport-book-result.helper';
import { BaseRacingTemplateService } from '../../../../common/services/base-racing-template.service';
import { GreyhoundRacingContentService } from './greyhound-racing-content.service';
import { RacingContentGreyhoundService } from 'src/app/greyhound-racing/services/data-feed/racing-content-greyhound.service';
import { RacingContentGreyhoundResult } from 'src/app/greyhound-racing/models/racing-content.model';
import { GreyhoundRacingRunnersService } from '../runners/services/greyhound-racing-runners.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { GreyhoundRacingResultService } from '../result/services/greyhound-racing-result.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { VirtualRaceImageService } from 'src/app/common/services/virtual-race-image.service';
import { EvrAvrConfigurationService } from 'src/app/common/services/evr-avr-configuration.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { RaceOffService } from 'src/app/common/services/race-off.service';
import { ScreenTypeService } from 'src/app/common/services/screen-type.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets } from 'src/app/common/models/gantrymarkets.model';
import { LoggerService } from 'src/app/common/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class GreyhoundRacingTemplateService extends BaseRacingTemplateService {

  private countryFlags: string;
  private meetingList: Array<string> = [];
  private virtualRaceSubject = new BehaviorSubject<RunnerImages>(null);
  isVirtualRaceFlag: boolean;

  errorMessage$ = this.errorService.errorMessage$;

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

  sportBookEvents$ = this.sportBookService.data$
    .pipe(
      tap((sportBookResult: SportBookResult) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
    catchError(err => {
      this.virtualRaceImageService.logError(err);
      return EMPTY;
    })
  );

  gantryMarkets$ = this.gantryMarketsService.gantryMarkets$
    .pipe(
      tap((gantryMarkets: Array<Markets>) => {

      }),
      catchError(err => {
        return EMPTY;
      })
    );


  data$ = combineLatest([
    this.sportBookEvents$,
    this.racingContent$,
    this.greyHoundData$,
    this.virtualRaceImageService$,
    this.raceOffService.isRaceOff$,
    this.gantryMarkets$
  ]).pipe(map(([sportBookResult, racingContent, greyHoundData, virtualRaceImageContent, isRaceOff, gantryMarkets]) => {
    let greyhoundRacingTemplateResult: GreyhoundRacingTemplateResult = new GreyhoundRacingTemplateResult();
    try {
      SportBookResultHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookResult);

      if (!this.countryFlags) {
        this.countryFlags = super.getFlag(sportBookResult);
        if (this.countryFlags) {
          this.greyhoundRacingContentService.setCountry(this.countryFlags);
        }
      }

      this.isVirtualRaceFlag = super.isEventVirtualRace([...sportBookResult.events.values()][0]?.typeFlagCode);
      this.racingContentGreyhoundService.setIsVirtual(this.isVirtualRaceFlag);
      this.greyhoundRacingResultService.isVirtualRaceFlag = this.isVirtualRaceFlag;
      this.greyhoundRacingResultService.meetingName = [...sportBookResult.events.values()][0]?.typeName?.trim()?.toUpperCase();
      if (this.isVirtualRaceFlag && !!virtualRaceImageContent) {
        greyHoundData.greyHoundImages = virtualRaceImageContent;
      }
      greyhoundRacingTemplateResult = this.prepareResult(sportBookResult, racingContent, greyHoundData, gantryMarkets);

      if (greyhoundRacingTemplateResult?.greyhoundRacingRunnersResult) {
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isRaceOff = isRaceOff;
      }
    } catch (error) {
      console.log(error);
      this.loggerService.logError(error);
    }
    return greyhoundRacingTemplateResult;
  }),
    catchError(err => {
      return EMPTY;
    })
  );

  constructor(private sportBookService: SportBookService,
    private racingContentGreyhoundService: RacingContentGreyhoundService,
    private greyhoundRacingContentService: GreyhoundRacingContentService,
    private greyhoundRacingRunnersService: GreyhoundRacingRunnersService,
    private greyhoundRacingResultService: GreyhoundRacingResultService,
    gantryCommonContentService: GantryCommonContentService,
    private errorService: ErrorService,
    private virtualRaceImageService: VirtualRaceImageService,
    private screenTypeService: ScreenTypeService,
    public gantryMarketsService: GantryMarketsService,
    evrAvrConfigurationService: EvrAvrConfigurationService, public raceOffService: RaceOffService,
    private loggerService: LoggerService) {
    super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    this.greyhoundRacingContentService.setImageType(true);
  }

  setEventKeyAndMarketKeys(eventKey: string, marketKeys: string) {
    let queryParamEventMarkets = new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));
    this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
    this.sportBookService.setMarketException(true);
    this.sportBookService.setRemoveSuspendedSelections(false);
    this.racingContentGreyhoundService.setEvent(new QueryParamEvent(eventKey));
    this.greyhoundRacingResultService.setEventId(new QueryParamEvent(eventKey));
  }

  prepareResult(sportBookResult: SportBookResult, racingContent: RacingContentGreyhoundResult, greyHoundImageData: GreyhoundStaticContent, gantryMarkets: Array<Markets>) {
    let isEventResulted: boolean = super.isEventResulted(sportBookResult);
    let event = [...sportBookResult.events.values()][0]; //Fetching event
    let isEvrRaceCheck: boolean = super.isEvrRaceCheck();
    //below line is making an API call to get to know event is EVR or not.
    super.setEvrAvrRaceCheck(event?.typeKey);
    if (super.isEvrRaceCheck()) {
      if (!event.offTime) {
        super.setEvrOffPageDelay();
      }
    }

    let greyhoundRacingTemplateResult = new GreyhoundRacingTemplateResult();
    greyhoundRacingTemplateResult.isAnyEventResulted = isEventResulted;
    if (!isEventResulted) {
      if (this.isVirtualRaceFlag) {
        let meetingName = event?.typeName?.trim()?.toUpperCase();
        let eventName = StringHelper.removeTimeInEventName(event?.eventName);
        if (!this.meetingList?.includes(meetingName)) {
          this.meetingList.push(meetingName);
          this.virtualRaceImageService.setEventAndMeetingName("1", meetingName, eventName);
          this.virtualRaceImageService$.subscribe((runnerImageContent) => {
            this.virtualRaceSubject.next(runnerImageContent);
          });
        }
      }
      greyhoundRacingTemplateResult.greyhoundRacingRunnersResult = this.greyhoundRacingRunnersService.createGreyhoundRacingRunnersResult(sportBookResult, racingContent, greyHoundImageData, this.countryFlags, gantryMarkets);
      if (greyhoundRacingTemplateResult?.greyhoundRacingRunnersResult) {
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isEvrRace = isEvrRaceCheck;
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isHalfScreenType = this.screenTypeService.isHalfScreenType;
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.isFullScreenType = this.screenTypeService.isFullScreenType;
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.showBannerPostPick = this.canShowBannerPostPick(greyhoundRacingTemplateResult.greyhoundRacingRunnersResult);
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.showFlexScreen = this.canShowFlexScreen(greyhoundRacingTemplateResult.greyhoundRacingRunnersResult);
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.marketSelectionPresent = this.getMarketSelectionPresent(greyhoundRacingTemplateResult.greyhoundRacingRunnersResult);
        greyhoundRacingTemplateResult.greyhoundRacingRunnersResult.showForm = this.canShowForm(greyhoundRacingTemplateResult.greyhoundRacingRunnersResult);
      }
    }

    return greyhoundRacingTemplateResult;
  }

  setIsHalfScreenType(ghrTemplateResult: GreyhoundRacingTemplateResult) {
    if (!!ghrTemplateResult?.greyhoundRacingRunnersResult) {
      ghrTemplateResult.greyhoundRacingRunnersResult.isFullScreenType = this.screenTypeService.isFullScreenType;
    }
  }

  canShowBannerPostPick(ghrRunningResult: GreyhoundRacingRunnersResult) {
    return (!ghrRunningResult?.areCurrentPricesPresent &&
      ghrRunningResult.racingContent?.runners?.length > 0) ||
      (ghrRunningResult.featureMarketList?.length > 0);
  }

  canShowFlexScreen(ghrRunningResult: GreyhoundRacingRunnersResult) {
    return (this.screenTypeService.isFullScreenType && ((ghrRunningResult.featureMarketList?.length) || (!ghrRunningResult.areCurrentPricesPresent &&
      ghrRunningResult.racingContent?.runners?.length)));
  }

  getMarketSelectionPresent(ghrRunningResult: GreyhoundRacingRunnersResult) {
    return (this.screenTypeService.isFullScreenType && ghrRunningResult.featureMarketList?.length);
  }

  canShowForm(ghrRunningResult: GreyhoundRacingRunnersResult) {
    return (this.screenTypeService.isFullScreenType && !ghrRunningResult.areCurrentPricesPresent && ghrRunningResult.racingContent?.runners?.length);
  }
}
