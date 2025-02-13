import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, combineLatest, concatMap, EMPTY, map, shareReplay, tap } from "rxjs";
import { AvrDataFeedService } from "src/app/common/services/data-feed/avr-service/avr-data-feed.service";
import { AvrEventMap, AvrResult } from "src/app/common/models/data-feed/avr.model";
import { AvrEventTypeEnum, AvrMessageTypeEnum } from "../models/avr-result-enum.model";
import { AvrPreambleService } from "./avr-preamble.service";
import { AvrResultService } from "./avr-result.service";
import { QueryParamEvent } from "src/app/common/models/query-param.model";
import { AvrStates } from "../models/avr-states";
import { FillerPageService } from "src/app/common/components/filler-page/services/filler-page.service";
import { AvrVideoService } from "./avr-video.service";
import { HttpService } from "src/app/common/services/http.service";
import { AvrPageConfiguration } from "../models/avr-result-content.model";
import { HttpParams } from "@angular/common/http";
import { AvrCommonService } from "./common/avr-common.service";
import { Log, LoggerService, LogType } from "src/app/common/services/logger.service";

@Injectable({
  providedIn: "root",
})
export class AvrService {
  private subject = new BehaviorSubject<string>(null);
  controllerId$ = this.subject.asObservable();
  eventType: string = "";
  event: number = 0;
  cycleStarted: boolean = false;
  cycleCompleted: boolean = false;
  previousEvent: AvrResult;
  previousPreamblevirtualEventKey: string;
  avrState$ = new BehaviorSubject<string>("");
  avrStates: typeof AvrStates = AvrStates;
  urlStaleDataMap = new Map<number, string>();
  fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;

  preambleTimeHorse: number;
  preambleTimeDog: number;
  preambleTimeMotor: number;
  countdownHorse: number;
  countdownDog: number;
  countdownMotor: number;
  videoTimeHorse: number;
  videoTimeDog: number;
  videoTimeMotor: number;
  resultTimeHorse: number;
  resultTimeDog: number;
  resultTimeMotor: number;
  offTime: number;

  avrDataFeed$ = this.avrDataFeedService.avrService$.pipe(
    tap((resultMap: AvrEventMap) => { }),
    catchError((err) => {
      return EMPTY;
    })
  );

  avrPageConfigurations$ = this.controllerId$.pipe(
    concatMap((controllerId: string) => {
      return this.httpService.get<AvrPageConfiguration>(
        "en/api/getAvrPageConfiguration",
        new HttpParams().set("controllerId", controllerId)
      );
    }),
    shareReplay()
  );

  avr$ = combineLatest([this.avrDataFeed$, this.avrPageConfigurations$]).pipe(
    map(([resultMap, avrPageConfig]) => {
      this.preambleTimeHorse = avrPageConfig.horsePreambleTime ?? 119;
      this.preambleTimeDog = avrPageConfig.dogPreambleTime ?? 77;
      this.preambleTimeMotor = avrPageConfig.motorPreambleTime ?? 101;
      this.countdownHorse = avrPageConfig.horseCountdownToOffTime ?? 116;
      this.countdownDog = avrPageConfig.dogCountdownToOffTime ?? 74;
      this.countdownMotor = avrPageConfig.motorCountdownToOffTime ?? 98;
      this.videoTimeHorse = avrPageConfig.horseVideoTime ?? 34;
      this.videoTimeDog = avrPageConfig.dogVideoTime ?? 47;
      this.videoTimeMotor = avrPageConfig.motorVideoTime ?? 74;
      this.resultTimeHorse = avrPageConfig.horseResultTime ?? 10;
      this.resultTimeDog = avrPageConfig.dogResultTime ?? 13;
      this.resultTimeMotor = avrPageConfig.motorResultTime ?? 10;
      this.offTime = avrPageConfig.offTime ?? 3

      return resultMap;
    }),
    tap((resultMap: AvrEventMap) => {
      for (let [, data] of resultMap.eventIds) {
        let eventId = resultMap?.eventIds.keys()?.next()?.value;
        for (let [, result] of data.messageTypes) {
          if (!this.cycleStarted && !this.event && result?.avr?.meta?.messageType.toUpperCase() == AvrMessageTypeEnum.ViewerEventCard) {
            this.event = eventId;
          }
          if (this.urlStaleDataMap.has(eventId)) {
            if (result?.avr?.meta?.messageType.toUpperCase() == this.urlStaleDataMap.get(eventId)) {
              return;
            }
          } else {
            if (!this.cycleStarted && eventId != this.event && result?.avr?.meta?.messageType.toUpperCase() == AvrMessageTypeEnum.ViewerEventCard) {
              this.cycleStarted = true;
            }
          }

          this.urlStaleDataMap.clear();
          this.urlStaleDataMap.set(eventId, result?.avr?.meta?.messageType.toUpperCase());

          if (this.cycleStarted) {
            if (result?.avr?.meta?.messageType.toUpperCase() == AvrMessageTypeEnum.ViewerEventCard) {
              // here based on event race types updated
              this.eventType = result?.avr?.eventType;
              if (!this.previousEvent) {
                this.setAvrCountDownTime(this.eventType);
                this.preambleService.setPreambleTemplate(result);
                this.resultService.setViewerEventCardTemplate(result);
                this.videoService.setEventName(this.resultService?.avrResultPage?.eventName);
              }
              if (!this.cycleCompleted) {
                this.avrState$.next("");
                this.showPageState(1);
                this.cycleCompleted = true;
              }
              this.previousEvent = new AvrResult();
              this.previousEvent = result;
            } else if (
              result?.avr?.meta?.messageType.toUpperCase() == AvrMessageTypeEnum.Result
            ) {
              this.resultService.setResultTemplate(result);
              if (this.resultService.isResultComplete) {
                this.fillerPageService.unSetFillerPage();
              }
            }
          } else {
            this.fillerPageService.setFillerPage("LOADING");
          }
        }
      }
    }),
    catchError((err) => {
      return EMPTY;
    })
  );

  setControllerId(controllerId: string) {
    this.subject.next(controllerId);
    this.avrDataFeedService.setControllerId(new QueryParamEvent(controllerId));
    this.avrCommonService.setControllerId(controllerId);
  }
  getCurrentState() {
    return this.avrState$.getValue();
  }

  constructor(
    private avrDataFeedService: AvrDataFeedService,
    private preambleService: AvrPreambleService,
    private resultService: AvrResultService,
    private videoService: AvrVideoService,
    private fillerPageService: FillerPageService,
    private httpService: HttpService,
    public avrCommonService: AvrCommonService,
    private loggerService: LoggerService
  ) { }

  showPageState(duration: number) {
    let timeOutFn: NodeJS.Timeout;

    if (timeOutFn) clearTimeout(timeOutFn);
    console.log("Moving to next state after this duration: " + duration);
    timeOutFn = setTimeout(() => {
      console.log("Moving to Next state time:" + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })));
      this.moveToNextState();
    }, duration * 1000);
  }

  moveToNextState() {
    if (this.getCurrentState() === "") {
      this.fillerPageService.setFillerPage("LOADING");
      this.avrState$.next(this.avrStates.ShowAvrPreamble);
      this.setShowPageState(this.eventType);
      return;
    }
    if (this.getCurrentState() === this.avrStates.ShowAvrPreamble) {
      this.previousPreamblevirtualEventKey = this.previousEvent.avr.virtualEventKey;
      this.log("Showing Avr Video Page" + "," + "virtualEventKey: " + this.previousPreamblevirtualEventKey, "Current Time in BTC timezone: " + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })), LogType.Information);
      this.avrState$.next(this.avrStates.ShowAvrVideo);
      console.log("Current Time in BTC timezone: " + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })));
      this.getAvrVideoTime(this.eventType);
      return;
    }
    if (this.getCurrentState() === this.avrStates.ShowAvrVideo) {
      this.log("Showing Avr Result Page" + "," + "virtualEventKey: " + this.previousPreamblevirtualEventKey, "Current Time in BTC timezone: " + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })), LogType.Information);
      this.avrState$.next(this.avrStates.ShowAvrResult);
      console.log("Current Time in BTC timezone: " + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })));
      this.getAvrResultTime(this.eventType);

      return;
    }
    if (this.getCurrentState() === this.avrStates.ShowAvrResult) {
      let newPreamblevirtualEventKey = this.previousEvent.avr.virtualEventKey;
      console.log("%c New Preamble Key: " + newPreamblevirtualEventKey + "%cPrevious Preamble Key: " + this.previousPreamblevirtualEventKey, "background: red; ")
      if (this.previousPreamblevirtualEventKey != newPreamblevirtualEventKey) {
        this.log("Showing Avr Preamble Page" + "," + "virtualEventKey: " + newPreamblevirtualEventKey, "Current Time in BTC timezone: " + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })), LogType.Information);
        let preambleTime = this.getNextPremableTimeOut();
        //this.preambleService.seconds = this.isHorseRace ? this.countdownHorse - this.delayTimeHorse : this.countdownDog - this.delayTimeDog;
        this.preambleService.seconds = (preambleTime / 1000) + 2;
        this.preambleService.setPreambleTemplate(this.previousEvent);
        this.resultService.setViewerEventCardTemplate(this.previousEvent);
        this.videoService.setEventName(
          this.resultService?.avrResultPage?.eventName
        );
        this.avrState$.next(this.avrStates.ShowAvrPreamble);
        console.log("Current Time in BTC timezone: " + new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })));
        this.getAvrPreambleTime(this.eventType);

      } else {
        //Continue to wait for next one second to get new preamble
        console.log("%c New Preamble Key: " + newPreamblevirtualEventKey + "%cPrevious Preamble Key: " + this.previousPreamblevirtualEventKey, "background: red; ")
        this.showPageState(3);
      }

    }
  }

  getNextPremableTimeOut() {
    console.log(this.previousEvent);
    console.log(this.previousEvent.avr.eventDateTime);
    let eventDate = this.previousEvent.avr.eventDateTime.split(' ')[0].split('/');
    let eventTime = this.previousEvent.avr.eventDateTime.split(' ')[1].split(':');

    //Future time of event.
    let eventDateTime = new Date(Number.parseInt(eventDate[2]), Number.parseInt(eventDate[1]) - 1, Number.parseInt(eventDate[0]), Number.parseInt(eventTime[0]), Number.parseInt(eventTime[1]), Number.parseInt(eventTime[2]));

    console.log("Future time of the Event: " + eventDateTime);

    //Current time.
    let currentDateTime = new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" }));

    console.log("Current time in BTC timezone: " + currentDateTime);
    let preambleTime = eventDateTime.getTime() - currentDateTime.getTime();
    console.log("%cPreamble time in milliseconds subtracting future time - Current time: " + preambleTime, "background: red; ");
    return preambleTime;
  }

  setAvrCountDownTime(eventType: string) {
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        this.preambleService.seconds = this.countdownHorse;
        break;
      case AvrEventTypeEnum.DogRace:
        this.preambleService.seconds = this.countdownDog;
        break;
      case AvrEventTypeEnum.MotorRace:
        this.preambleService.seconds = this.countdownMotor;
        break;
    }
  }

  setShowPageState(eventType: string) {
    let pageDuration: number;
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        pageDuration = this.preambleTimeHorse;
        break;
      case AvrEventTypeEnum.DogRace:
        pageDuration = this.preambleTimeDog;
        break;
      case AvrEventTypeEnum.MotorRace:
        pageDuration = this.preambleTimeMotor;
        break;
    }
    this.showPageState(pageDuration);
  }

  getAvrVideoTime(eventType: string) {
    let videoTime: number;
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        console.log("Showing video for horse seconds: " + this.videoTimeHorse)
        videoTime = this.videoTimeHorse;
        break;
      case AvrEventTypeEnum.DogRace:
        console.log("Showing video for dogs seconds: " + this.videoTimeDog)
        videoTime = this.videoTimeDog;
        break;
      case AvrEventTypeEnum.MotorRace:
        console.log("Showing video for motor seconds: " + this.videoTimeMotor)
        videoTime = this.videoTimeMotor;
        break;
    }
    this.showPageState(videoTime);
  }

  getAvrResultTime(eventType: string) {
    let resultTime: number;
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        console.log("Showing Result for horse seconds: " + this.resultTimeHorse)
        resultTime = this.resultTimeHorse;
        break;
      case AvrEventTypeEnum.DogRace:
        console.log("Showing Result for dogs seconds: " + this.resultTimeDog)
        resultTime = this.resultTimeDog;
        break;
      case AvrEventTypeEnum.MotorRace:
        console.log("Showing Result for motor seconds: " + this.resultTimeMotor)
        resultTime = this.resultTimeMotor;
        break;
    }
    this.showPageState(resultTime);
  }

  getAvrPreambleTime(eventType: string) {
    let preambleTime: number;
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        console.log("Showing Preamble for horse seconds: " + (this.preambleService.seconds + this.offTime))
        preambleTime = this.preambleService.seconds + this.offTime;
        break;
      case AvrEventTypeEnum.DogRace:
        console.log("Showing Preamble for dogs seconds: " + (this.preambleService.seconds + this.offTime))
        preambleTime = this.preambleService.seconds + this.offTime;
        break;
      case AvrEventTypeEnum.MotorRace:
        console.log("Showing Preamble for motor seconds: " + (this.preambleService.seconds + this.offTime))
        preambleTime = this.preambleService.seconds + this.offTime;
        break;
    }
    this.showPageState(preambleTime);
  }

  log(stateAndEventId: string, message: string, level: LogType = LogType.Error, status: string = "200", fatal: boolean = false) {
    let log: Log = {
      level: level,
      message: `${stateAndEventId}: ${message}`,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(log);
  }
}
