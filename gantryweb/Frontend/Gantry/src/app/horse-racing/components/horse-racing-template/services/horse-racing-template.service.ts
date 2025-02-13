import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RacingContentResult } from '../../../models/data-feed/racing-content.model';
import { SportBookResult } from '../../../../common/models/data-feed/sport-bet-models';
import { HorseRacingRunnersResult, HorseRacingTemplateResult, RunnerImages } from '../../../models/horse-racing-template.model';
import { QueryParamEventMarkets, QueryParamEvent, QueryParamMarkets } from '../../../../common/models/query-param.model';
import { RacingContentService } from '../../../services/data-feed/racing-content.service';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { SportBookResultHelper } from 'src/app/common/helpers/sport-book-result.helper';
import { HorseRacingContentService } from 'src/app/horse-racing/services/horseracing-content.service';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';
import { BaseRacingTemplateService } from 'src/app/common/services/base-racing-template.service';
import { HorseRacingRunnersService } from '../runners/services/horse-racing-runners.service';
import { HorseRacingResultService } from '../result/services/horse-racing-result.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { BestOddsGuaranteedImageService } from '../runners/services/best.odds.guaranteed.image.service';
import { BrandImageContent } from 'src/app/common/components/error/models/error-content.model';
import { ErrorService } from 'src/app/common/services/error.service';
import { VirtualRaceImageService } from 'src/app/common/services/virtual-race-image.service';
import { EvrAvrConfigurationService } from 'src/app/common/services/evr-avr-configuration.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { RaceOffService } from 'src/app/common/services/race-off.service';
import { EventStatusType } from 'src/app/common/models/general-codes-model';
import { ScreenTypeService } from 'src/app/common/services/screen-type.service';
import { CheckEvrAvrByTypeId } from 'src/app/common/models/evr-avr-configuration.model';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { ImageStatus } from 'src/app/horse-racing/models/fallback-src.constant';
import { LoggerService } from 'src/app/common/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class HorseRacingTemplateService extends BaseRacingTemplateService {
  private meetingList: Array<string> = [];
  isVirtualRaceFlag: boolean;
  isStop: boolean = true;
  private virtualRaceSubject = new BehaviorSubject<RunnerImages>(null);


  errorMessage$ = this.errorService.errorMessage$;

  sportBookEvents$ = this.sportBookService.data$.pipe(
    tap((sportBookResult: SportBookResult) => {
      this.errorService.isStaleDataAvailable = true;
      this.errorService.unSetError();
    }),
    catchError((err) => {
      this.errorService.logError(err);
      return EMPTY;
    })
  );

  racingContent$ = this.racingContentService.data$.pipe(
    tap((racingContent: RacingContentResult) => {
    }),
    catchError((err) => {
      return EMPTY;
    })
  );

  horseRacingContent$ = this.horseRacingContent.data$.pipe(
    tap((horseRacingContent: HorseRacingContent) => { }),
    catchError((err) => {
      return EMPTY;
    })
  );

  bestOddsGuaranteedImage$ = this.bestOddsGuaranteedImage.brandImage$;

  virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
    catchError((err) => {
      this.virtualRaceImageService.logError(err);
      return EMPTY;
    })
  );

  data$ = combineLatest([
    this.sportBookEvents$,
    this.racingContent$,
    this.horseRacingContent$,
    this.bestOddsGuaranteedImage$,
    this.virtualRaceImageService$,
    this.raceOffService.isRaceOff$,
    this.evrAvrConfigurationService.evrAvrRace$
  ]).pipe(
    map(([sportBookResult, racingContent, horseRacingContent, bestOddsGuaranteedImage, virtualRaceImageContent, isRaceOff, isEvrAvrRace]) => {
      let horseRacingTemplateResult: HorseRacingTemplateResult = new HorseRacingTemplateResult();
      try {
        SportBookResultHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookResult);
        this.horseRacingResultService.meetingName = [...sportBookResult.events.values()][0]?.typeName?.trim()?.toUpperCase();
        this.isVirtualRaceFlag = super.isEventVirtualRace([...sportBookResult.events.values()][0]?.typeFlagCode);
        this.racingContentService.setIsVirtual(this.isVirtualRaceFlag);
        this.horseRacingResultService.isVirtualRaceFlag = this.isVirtualRaceFlag;
        this.horseRacingRunnersService.isVirtualRaceFlag = this.isVirtualRaceFlag;
        if (this.isVirtualRaceFlag && !!virtualRaceImageContent) {
          this.horseRacingRunnersService.virtualRaceSilkImage = virtualRaceImageContent;
        }
        horseRacingTemplateResult = this.prepareResult(
          sportBookResult,
          racingContent,
          horseRacingContent,
          bestOddsGuaranteedImage,
          isEvrAvrRace,
        );

        if (horseRacingTemplateResult?.horseRacingRunnersResult) {
          horseRacingTemplateResult.horseRacingRunnersResult.isRaceOff = isRaceOff;
        }

        if (racingContent?.hasRacingContent !== undefined && !racingContent?.hasRacingContent) {
          horseRacingTemplateResult.horseRacingRunnersResult.horseRacingEntries.map(horseRacingEntry => {
            if (horseRacingEntry.jockeySilkImage === ImageStatus.Default) {
              horseRacingEntry.jockeySilkImage = ImageStatus.ImageNotPresent;
            }
          })
        }

      } catch (error) {
        console.log(error);
        this.loggerService.logError(error);
      }
      return horseRacingTemplateResult;
    }),
    catchError((err) => {
      return EMPTY;
    })
  );

  constructor(
    private sportBookService: SportBookService,
    private racingContentService: RacingContentService,
    private horseRacingContent: HorseRacingContentService,
    private horseRacingResultService: HorseRacingResultService,
    private horseRacingRunnersService: HorseRacingRunnersService,
    gantryCommonContentService: GantryCommonContentService,
    private bestOddsGuaranteedImage: BestOddsGuaranteedImageService,
    private errorService: ErrorService,
    private virtualRaceImageService: VirtualRaceImageService,
    private screenTypeService: ScreenTypeService,
    public evrAvrConfigurationService: EvrAvrConfigurationService,
    public raceOffService: RaceOffService,
    public gantryMarketsService: GantryMarketsService,
    private loggerService: LoggerService
  ) {
    super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
  }

  public setEvenKeyAndMarketKeys(eventKey: string, marketKeys: string) {
    let queryParamEventMarkets = new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));

    this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
    this.racingContentService.setEvent(new QueryParamEvent(eventKey));
    this.horseRacingResultService.setEventId(eventKey);
    this.sportBookService.setMarketException(true);
    this.sportBookService.setRemoveSuspendedSelections(false);
  }


  private prepareResult(
    sportBookResult: SportBookResult,
    racingContent: RacingContentResult,
    horseRacingContent: HorseRacingContent,
    bestOddsGuaranteedImage: BrandImageContent,
    isEvrAvrRace: CheckEvrAvrByTypeId,
  ) {
    let isEventResulted: boolean = super.isEventResulted(sportBookResult);
    let isEvrRaceCheck: boolean = isEvrAvrRace.isEvrRace;
    let isAvrRaceCheck: boolean = isEvrAvrRace.isAvrRace;

    let event = [...sportBookResult.events.values()][0];
    //below line is making an API call to get to know event is EVR or not.
    super.setEvrAvrRaceCheck(event?.typeKey);
    if (super.isEvrRaceCheck()) {
      if (!event.offTime) {
        super.setEvrOffPageDelay();
      }
    }
    let horseRacingTemplateResult = new HorseRacingTemplateResult();
    horseRacingTemplateResult.isAnyEventResulted = isEventResulted;
    if (this.isVirtualRaceFlag) {
      let meetingName = event?.typeName?.trim()?.toUpperCase();
      let eventName = StringHelper.removeTimeInEventName(event?.eventName);
      if (!this.meetingList?.includes(meetingName)) {
        this.meetingList.push(meetingName);
        this.virtualRaceImageService.setEventAndMeetingName('0', meetingName, eventName);
        this.virtualRaceImageService$.subscribe((runnerImageContent) => {
          this.virtualRaceSubject.next(runnerImageContent);
        });
      }
    }
    horseRacingTemplateResult.horseRacingRunnersResult = this.horseRacingRunnersService.createHorseRacingRunnersResult(
      sportBookResult,
      racingContent,
      horseRacingContent
    );
    if (horseRacingTemplateResult?.horseRacingRunnersResult) {
      horseRacingTemplateResult.horseRacingRunnersResult.isEvrRace = isEvrRaceCheck;
      horseRacingTemplateResult.horseRacingRunnersResult.isAvrRace = isAvrRaceCheck;
      horseRacingTemplateResult.horseRacingRunnersResult.isHalfScreenType = this.screenTypeService.isHalfScreenType;
      horseRacingTemplateResult.horseRacingRunnersResult.showBackPrice = this.canShowBackPrice(horseRacingTemplateResult?.horseRacingRunnersResult);
      horseRacingTemplateResult.horseRacingRunnersResult.isInternationalRace = StringHelper.isInternationalRace(horseRacingTemplateResult.horseRacingRunnersResult?.typeFlagCode);
      horseRacingTemplateResult.horseRacingRunnersResult.showPostPick = this.canShowPostPick(horseRacingTemplateResult?.horseRacingRunnersResult);
    }
    if (isEvrRaceCheck) {
      horseRacingTemplateResult.horseRacingRunnersResult.racingContent = this.getRaceTypeAndDistance(
        horseRacingTemplateResult.horseRacingRunnersResult.racingContent,
        horseRacingContent,
        event?.typeKey
      );
    }

    var todayDate = new Date();
    //Ravi(02/05/2023): need to refactor below condition to another function.
    if (
      horseRacingTemplateResult?.horseRacingRunnersResult?.eventDateTime &&
      new Date(horseRacingTemplateResult?.horseRacingRunnersResult?.eventDateTime)?.toISOString().slice(0, 10) ==
      todayDate.toISOString().slice(0, 10) &&
      (horseRacingTemplateResult?.horseRacingRunnersResult?.typeFlagCode?.includes('UK') ||
        horseRacingTemplateResult?.horseRacingRunnersResult?.typeFlagCode?.includes('IE')) &&
      todayDate.getHours() >= 8
    ) {
      horseRacingTemplateResult.horseRacingRunnersResult.bestOddsGuaranteedImageSrc = bestOddsGuaranteedImage?.brandImage?.src;
    }
    horseRacingTemplateResult.isAnyEventResulted = this.isEventResultedBasedOnEventStatus(sportBookResult, racingContent);

    return horseRacingTemplateResult;
  }

  canShowBackPrice(hrsRunningResult: HorseRacingRunnersResult) {
    return (!this.screenTypeService?.isHalfScreenType || (this.screenTypeService?.isHalfScreenType && hrsRunningResult?.markets?.length < 3));
  }
  canShowPostPick(hrsRunningResult: HorseRacingRunnersResult) {
    return (this.screenTypeService.isHalfScreenType && !hrsRunningResult.isInternationalRace && !hrsRunningResult.isVirtualEvent);
  }


  getRaceTypeAndDistance(
    racingContent: RacingContentResult,
    horseRacingContent: HorseRacingContent,
    typeId: string
  ): RacingContentResult {
    let racetypeAndDistance = horseRacingContent?.contentParameters[typeId]?.split('|');
    if (!!racetypeAndDistance && racetypeAndDistance?.length > 0) {
      racingContent.evrRaceType = racetypeAndDistance[0];
      racingContent.distance = racetypeAndDistance[1];
    }
    return racingContent;
  }

  isEventResultedBasedOnEventStatus(sportBookResult: SportBookResult,
    racingContent: RacingContentResult): boolean {
    return super.isEventResulted(sportBookResult)
      || racingContent?.sisData?.eventStatusCode?.toUpperCase() === EventStatusType.photo
      || racingContent?.sisData?.eventStatusCode?.toUpperCase() === EventStatusType.void;
  }
}
