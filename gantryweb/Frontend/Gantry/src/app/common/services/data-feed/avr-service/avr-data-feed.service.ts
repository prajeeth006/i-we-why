import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, concatMap, map, scan, shareReplay } from 'rxjs';
import { AvrResult, AvrTempResult } from 'src/app/common/models/data-feed/avr.model';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { EventSourceDataFeedService } from 'src/app/common/services/event-source-data-feed.service';
import { EventFeedUrlService } from '../../event-feed-url.service';
import { WindowHelper } from 'src/app/common/helpers/window-helper/window-helper';
import { Log, LoggerService, LogType } from '../../logger.service';

@Injectable({
  providedIn: 'root'
})
export class AvrDataFeedService {
  private eventSubject = new BehaviorSubject<QueryParamEvent>(null);
  private event$ = this.eventSubject.asObservable();
  private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

  private urlSubject = new BehaviorSubject<string>("");
  constructor(
    private eventSourceDataFeedService: EventSourceDataFeedService,
    private eventFeedUrlService: EventFeedUrlService,
    private _windowHelper: WindowHelper,
    private loggerService: LoggerService
  ) { }

  avrService$ = this.eventFeedUrlService.eventFeedApiUrls$.pipe(
    concatMap((eventFeedApiUrls) => {
      let url = `${eventFeedApiUrls.avrApi}${this.eventSubject.getValue().key}`;

      return this.eventSourceDataFeedService.getServerSentEvent(url, true, 0, false)
        .pipe(dataString => {
          try {
            return dataString.pipe(
            map(dataString => {
              let parsedData = JSON.parse(dataString);
              let tempResult = new AvrTempResult();

              if (parsedData.avr) {
                let result: AvrResult = Object.assign(new AvrResult, parsedData);
                this.log(`Got AVR data from DF, virtualEventKey: ${result?.avr?.virtualEventKey}, MessageType: ${result?.avr?.meta?.messageType}, Current Time in BTC timezone: ${new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" }))}`)
                tempResult.newItem = result;
              }
              return tempResult;
            }
            ))
          } catch (error) {
            console.error(error);
            this.log(`Error in processing data from AVR ${error}`, LogType.Error, "500", true);
          }
        }, scan((tempResultSum: AvrTempResult, newTempResult: AvrTempResult) => {
          if (newTempResult.newItem instanceof AvrResult) {
            let newMeetingResult = newTempResult.newItem;
            tempResultSum.messageMap.messageTypes?.clear();
            tempResultSum.messageMap.messageTypes.set(newMeetingResult?.avr?.meta?.messageType.toUpperCase(), newMeetingResult);
            if (!tempResultSum.result.eventIds.has(Number(newMeetingResult.avr?.eventId))) {
              tempResultSum.result.eventIds.clear();
            }
            tempResultSum.result.eventIds.set(Number(newMeetingResult.avr?.eventId), tempResultSum.messageMap);
          }
          return tempResultSum;
        }, new AvrTempResult()),
          map((meetingResult: AvrTempResult) => {
            this._windowHelper.raiseEventToElectron();
            return meetingResult.result
          }),
          shareReplay()
        );
    }));

  data$ = combineLatest([
    this.event$,
    this.eventFeedApiUrls$
  ])
    .pipe(
      concatMap(([event, eventFeedApiUrls]) => {
        let url = `${eventFeedApiUrls.avrApi}${event.key}`;
        this.setUrl(url);
        return this.avrService$;
      }),
    );

  setUrl(url: string) {
    this.urlSubject.next(url);
  }

  setControllerId(controllerId: QueryParamEvent) {
    this.eventSubject.next(controllerId);
  }

  log( message: string, level: LogType = LogType.Information, status: string = "200", fatal: boolean = false) {
    let log: Log = {
      level: level,
      message: `${message}`,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(log);
  }
}