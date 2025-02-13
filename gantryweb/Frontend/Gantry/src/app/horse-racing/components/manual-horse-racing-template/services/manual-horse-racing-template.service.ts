import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HorseRacingMarkets } from 'src/app/horse-racing/models/common.model';
import { ManualHorseRacingEntry, ManualHorseRacingResponse, ManualHorseRacingRunners, ManualHorseRacingTemplateResult, ManualHorseRunners, RacingContentData } from 'src/app/horse-racing/models/horse-racing-manual-template.model';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';
import { HorseRacingContentService } from 'src/app/horse-racing/services/horseracing-content.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { HorseRacing } from 'src/app/horse-racing/models/hose-racing-common.enum';
import { BrandImageContent } from 'src/app/common/components/error/models/error-content.model';
import { HttpService } from 'src/app/common/services/http.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { SignalrService } from 'src/app/common/signalRService/signalr.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ManualHorseRacingTemplateService {

  errorMessage$ = this.errorService.errorMessage$;
  racingContentBehaviourSubject$ = new BehaviorSubject<ManualHorseRacingTemplateResult>(null);


  constructor(
    private httpService: HttpService,
    private errorService: ErrorService,
    private horseRacingContent: HorseRacingContentService,
    private signalrService: SignalrService,
    private loggerService: LoggerService
  ) {
    this.subscribeToSignalR();
  }

  horseRacingContent$ = this.horseRacingContent.data$.pipe(
    tap((horseRacingContent: HorseRacingContent) => {
    }),
    catchError((err) => {
      return EMPTY;
    })
  );

  racingContent$: Observable<ManualHorseRacingTemplateResult> = this.racingContentBehaviourSubject$.pipe(
    catchError((err) => {
      return EMPTY;
    })
  );

  manualHorseRacingImage$ = this.httpService.get<BrandImageContent>('en/api/getBrandImage?path=/Gantry/GantryWeb/HorseRacingContent/ManualHorseRacingImage')
    .pipe(
      catchError(err => {
        return EMPTY;
      }),
      shareReplay()
    );

  data$ = combineLatest([
    this.horseRacingContent$,
    this.racingContent$,
    this.manualHorseRacingImage$
  ]).pipe(
    map(([horseRacingContent, racingContent, manualHorseRacingImageContent]) => {
      try {
        let manualHorseRacingTemplateData = new ManualHorseRacingResponse();
        manualHorseRacingTemplateData.isAnyEventResulted = racingContent?.isEventResulted;
        manualHorseRacingTemplateData.manualHorseRacingRunners = new ManualHorseRacingRunners();

        manualHorseRacingTemplateData.manualHorseRacingRunners.horseRacingContent = horseRacingContent;
        manualHorseRacingTemplateData.manualHorseRacingRunners.categoryName = horseRacingContent?.contentParameters?.Title;
        if (!!racingContent?.timehrs && !!racingContent?.timemins && !!racingContent?.meetingName) {
          let eventTime = racingContent?.timehrs + ":" + racingContent?.timemins;
          manualHorseRacingTemplateData.manualHorseRacingRunners.eventTimePlusTypeName = eventTime + " " + racingContent?.meetingName;
        }
        manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent = new RacingContentData();
        manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent.raceNo = parseInt(racingContent?.race);
        manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent.distance = racingContent?.distance;
        manualHorseRacingTemplateData.manualHorseRacingRunners.racingContent.going = racingContent?.going;

        let manualHorseRacingImage = manualHorseRacingImageContent?.brandImage?.src;
        this.setHorseRacingEntries(manualHorseRacingTemplateData, racingContent?.Runners, manualHorseRacingImage);

        manualHorseRacingTemplateData.manualHorseRacingRunners.isRaceOff = racingContent?.raceoff;
        manualHorseRacingTemplateData.manualHorseRacingRunners.runnerCount = racingContent?.run;
        manualHorseRacingTemplateData.manualHorseRacingRunners.marketEachWayString = this.setEachWay(racingContent?.eachway);
        return manualHorseRacingTemplateData;
      } catch (e) {
        this.signalrService.setSignalRErrorStatus(e.stack);
        console.error(e)
        this.log(`Error in processing ManualHorseRacingResponse ${e}`, LogType.Error, 'NA', true);
      }

    }),
    catchError((err) => {
      return EMPTY;
    })
  )

  public setEachWay(eachWay: string): string {
    let eachWayPositions = eachWay?.trim()?.split(' ');
    if (!!eachWayPositions && (eachWayPositions[2] === '1/1' || eachWay?.toLocaleUpperCase() === HorseRacingMarkets.WinOnly) || !eachWay) {
      return HorseRacingMarkets.WinOnly;
    }
    if (eachWayPositions?.length == 4) {
      let eachWayStr = "EACH-WAY: " + eachWayPositions[2] + " " + eachWayPositions[3] + ", " + eachWayPositions[0] + " " + eachWayPositions[1];
      return eachWayStr.toLocaleUpperCase();
    } else {
      return eachWay.toLocaleUpperCase();
    }
  }

  public calculatedPrice(oddsPrice: string): number {
    let price = 0;
    if (oddsPrice?.includes('/')) {
      let denPrice = 1;
      const oddsPriceArr = oddsPrice?.split('/');
      let numPrice = parseInt(oddsPriceArr[0]);
      if (oddsPriceArr[1]) {
        denPrice = parseInt(oddsPriceArr[1]);
      }
      price = numPrice / denPrice;
    } else {
      price = parseInt(oddsPrice);
    }
    return isNaN(price) ? 0 : price;
  }

  public setHorseRacingEntries(manualHorseRacingResponse: ManualHorseRacingResponse,
    runnerShowPrices: ManualHorseRunners[],
    manualHorseRacingImage: string,
  ) {

    if (!!runnerShowPrices) {
      let activeRunners: Array<ManualHorseRacingEntry> = [];
      let inactiveRunners: Array<ManualHorseRacingEntry> = [];
      for (const manualHorse of runnerShowPrices) {
        let horseRacingEntry = new ManualHorseRacingEntry();
        horseRacingEntry.horseNumber = manualHorse?.horseNumber;
        horseRacingEntry.horseName = manualHorse?.horseName;
        if (horseRacingEntry.horseName?.toLowerCase().includes(HorseRacing.Reserve.toLowerCase())) {
          horseRacingEntry.isReserved = true;
          horseRacingEntry.horseName = StringHelper.checkReserveRunner(horseRacingEntry.horseName);
        }
        horseRacingEntry.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseRacingEntry.horseName, SelectionNameLength.Eighteen);
        horseRacingEntry.jockeyName = manualHorse?.jockeyName;
        horseRacingEntry.nonRunner = manualHorse?.isNonRunner;
        horseRacingEntry.isStartPrice = manualHorse?.isStartPrice;

        horseRacingEntry.jockeySilkImage = manualHorseRacingImage;

        if (horseRacingEntry.nonRunner) {
          horseRacingEntry.jockeyName = HorseRacing.NonRunner;
          inactiveRunners.push(horseRacingEntry);
        } else {
          horseRacingEntry.fractionPrice = manualHorse?.price_odds_sp;
          horseRacingEntry.currentPrice = manualHorse?.isStartPrice ? 0 : this.calculatedPrice(manualHorse?.price_odds_sp?.toString());
          activeRunners.push(horseRacingEntry);
        }
      }
      activeRunners.sort((a, b) => a.currentPrice - b.currentPrice);
      manualHorseRacingResponse.manualHorseRacingRunners.bettingFavouritePrice = activeRunners[0]?.currentPrice;
      manualHorseRacingResponse.manualHorseRacingRunners.horseRacingEntries = [...activeRunners, ...inactiveRunners]
    }
  }

  subscribeToSignalR() {
    this.signalrService.hubSingleRMessage$.subscribe((eventformdata: any) => {
      if (!!eventformdata) {
        let eventData: ManualHorseRacingTemplateResult = Object.assign(new ManualHorseRacingTemplateResult, eventformdata);
        this.racingContentBehaviourSubject$.next(eventData);
      }
    })
  }

  log(message: string, level: LogType = LogType.Error, status: string, fatal: boolean = false) {
    let log: Log = {
      level: level,
      message: `${message}`,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(log);
  }
}
