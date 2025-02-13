import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, combineLatest, map, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { GantryCommonContent } from 'src/app/common/models/gantry-commom-content.model';
import { ManualOutRightResult, ManualOutRightSelection } from 'src/app/common/models/manual-outright.module';
import { ErrorService } from 'src/app/common/services/error.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { SignalrService } from 'src/app/common/signalRService/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class ManualOutrightTemplateService {

  manualOutRightContent: ManualOutRightResult;

  constructor(private errorService: ErrorService,
    private signalrService: SignalrService,
    private loggerService: LoggerService,
    private gantryCommonContentService: GantryCommonContentService) {
    this.subscribeToSignalR();
  }

  errorMessage$ = this.errorService.errorMessage$;
  outRightContentBehaviourSubject$ = new BehaviorSubject<ManualOutRightResult>(null);

  gantryCommonContent$ = this.gantryCommonContentService.data$
    .pipe(
      tap((gantryCommonContent: GantryCommonContent) => {
        JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  data$ = combineLatest([
    this.outRightContentBehaviourSubject$,
    this.gantryCommonContent$
  ]).pipe(
    map(([manualFormContent, gantryCommonContent]) => {
      try {
        let manualOutRightResult = new ManualOutRightResult();
        this.prepareResult(manualOutRightResult, manualFormContent, gantryCommonContent);
        return manualOutRightResult;
      } catch (e) {
        console.error(e)
        this.log(`Error in processing ManualOutRightResult ${e}`, LogType.Error, 'NA', true);
      }

    }),
    catchError((err) => {
      return EMPTY;
    })
  )

  subscribeToSignalR() {
    this.signalrService.hubSingleRMessage$.subscribe((eventformdata: any) => {
      if (!!eventformdata) {
        let eventData: ManualOutRightResult = Object.assign(new ManualOutRightResult, eventformdata);
        this.outRightContentBehaviourSubject$.next(eventData);
      }
    })
  }

  prepareResult(manualOutRightResult: ManualOutRightResult, manualFromData: ManualOutRightResult, gantryCommonContent: GantryCommonContent) {
    if (!!manualFromData) {
      if (!!manualFromData?.date) {
        let getDate = this.prepareDataFormat(manualFromData?.date?.toString());
        let eventTime = !!manualFromData?.time ? " " + manualFromData?.time : "";
        let eventDate = !!manualFromData?.date ? getDate + eventTime : "";
        const eventDateTime: Date = new Date(eventDate);
        if (eventDateTime?.toString() != 'Invalid Date') {
          manualOutRightResult.date = eventDateTime;
        }
        else {
          console.log("Invalid event Date :", manualFromData?.date + " " + manualFromData?.time);
          this.log(`Error in manual outright templeate in Invalid event Date: ${manualFromData?.date + " " + manualFromData?.time}`, LogType.Error, 'DateTime conversion Error', true);
        }
      }
      manualOutRightResult.outRightTitle = manualFromData?.sportName?.toUpperCase();
      manualOutRightResult.eventName = manualFromData?.eventName;
      if (manualFromData?.Runners?.length > 0) {
        manualOutRightResult.Runners = new Array<ManualOutRightSelection>();
        manualFromData?.Runners?.forEach(selection => {
          let outRightDetails: ManualOutRightSelection = new ManualOutRightSelection();
          outRightDetails.selectionName = selection?.selectionName?.toUpperCase();
          let currentPrice = StringHelper.calculatedPrice(selection.odds)
          outRightDetails.price = currentPrice;
          outRightDetails.odds = SportBookMarketHelper.getManualPrepareEvs(selection.odds);
          manualOutRightResult.Runners.push(outRightDetails);
        });
        manualOutRightResult?.Runners.sort((a, b) => a.price - b.price);
      }
      manualOutRightResult.racingContent = gantryCommonContent;
      manualOutRightResult.marketEachWay = gantryCommonContent.contentParameters.ManualBottomStipLine;
    }
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

  prepareDataFormat(finalDate: string): string {
    if (finalDate?.includes('/')) {
      const [day, month, year] = finalDate?.split('/');
      finalDate = month + '/' + day + '/' + year;
    }
    else if (finalDate?.includes('-')) {
      const [day, month, year] = finalDate?.split('-');
      finalDate = month + '/' + day + '/' + year;
    }
    return finalDate;
  }
}
