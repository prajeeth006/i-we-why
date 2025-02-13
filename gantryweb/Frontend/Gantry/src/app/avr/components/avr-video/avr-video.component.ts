import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import RxPlayer from "rx-player";
import { catchError, EMPTY, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { EventFeedUrlService } from 'src/app/common/services/event-feed-url.service';
import { Log, LoggerService, LogType } from 'src/app/common/services/logger.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { AvrTemplate } from '../../models/avr-template.model';
import { AvrVideoService } from '../../services/avr-video.service';
import { FillerPageService } from 'src/app/common/components/filler-page/services/filler-page.service';
import { ErrorService } from 'src/app/common/services/error.service';
RxPlayer.LogLevel = 'DEBUG';

@Component({
  selector: 'gn-avr-video',
  templateUrl: './avr-video.component.html',
  styleUrls: ['./avr-video.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvrVideoComponent implements OnDestroy {

  avrVideoUrl: string;
  rxPlayer: RxPlayer;
  isVideoPlaying: boolean = false;
  maxRetryCount: number = 9; // Retry is 9 because with each retry, we will wait for sometime which will be 1000*retryCount. So 9 retry means 1+2+3+4... 45 seconds, and we only need to show video for max 40 seconds.
  retryCount: number = 0;
  timeout: NodeJS.Timeout;
  isRetryCalled = false;
  isVideoHasError: boolean = false;
  vm$ = this.avrVideoService.data$.pipe(
    tap((result: AvrTemplate) => {
      JSON.stringify(result, JsonStringifyHelper.replacer);
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  constructor(private eventFeedUrlService: EventFeedUrlService,
    private routeDataService: RouteDataService,
    private loggerService: LoggerService,
    private avrVideoService: AvrVideoService,
    private fillerPageService: FillerPageService,
    private errorService: ErrorService) {
    let queryParams = this.routeDataService.getQueryParams();
    let controllerId = queryParams['controllerId'];
    this.avrVideoService.setControllerId(controllerId);
    this.isVideoPlaying = false;
  }

  ngOnDestroy(): void {
    this.rxPlayer?.dispose();
    this.unsetErrorPageOnVideo();
    clearTimeout(this.timeout);
  }

  ngAfterViewInit(): void {
    this.eventFeedUrlService.eventFeedApiUrls$.subscribe((urls) => {
      let controllerId = this.routeDataService.getQueryParams()['controllerId'];
      this.avrVideoUrl = urls.avrVideoUrl[controllerId];
      this.loadVideo();
    });
  }

  loadVideo() {
    try {
      console.log(`Load video called retry count: ${this.retryCount}, maxretrycount: ${this.maxRetryCount}`);
      this.rxPlayer?.dispose();
      this.rxPlayer = new RxPlayer({
        videoElement: document.querySelector("video")
      });

      this.rxPlayer.loadVideo({
        url: this.avrVideoUrl,
        transport: "dash",
        autoPlay: true,
        lowLatencyMode: true,
        networkConfig: {
          manifestRetry: this.maxRetryCount,
          segmentRetry: this.maxRetryCount
        },
        startAt: { fromLastPosition: 0 }, // Play 2 seconds from the live edge instead
        // (beware of much more frequent rebuffering
        // risks)
      });

      this.errorEventListener(this.rxPlayer);
      this.warningEventListener(this.rxPlayer);
      this.playerStateChangeListener(this.rxPlayer);

    } catch (err: any) {
      console.log(err);
      this.retryLoadVideo();
      this.log(this.avrVideoUrl, `ERROR in Loading video in RX Player where ERROR Message is ${err?.message}, Error : ${err}`, LogType.Error, "AvrVideoStoppedWorking", true);
    }
  }

  errorEventListener(rxPlayer: RxPlayer) {
    rxPlayer.addEventListener("error", (err: any) => {
      this.retryLoadVideo();
      console.error(`RX Player video is STOPPED with following errorType: ${err.errorType}, errorStatus: ${err.status}, errorMessage: ${err.message}, errorCode: ${err.code}, url: ${err.url}`);

      this.log(this.avrVideoUrl, `RX Player video is STOPPED with following errorType: ${err.errorType}, errorStatus: ${err.status}, errorMessage: ${err.message}, errorCode: ${err.code}, url: ${err.url}`, LogType.Error, "AvrVideoStoppedWorking", true);
    });
  }

  retryLoadVideo() {
    if (!this.isRetryCalled) {
      this.isRetryCalled = true;
      this.timeout = setTimeout(() => {
        if (this.retryCount <= this.maxRetryCount) {
          this.isRetryCalled = false;
          ++this.retryCount;
          this.loadVideo();
        }
      }, 1000 * this.retryCount);
    }
  }

  warningEventListener(rxPlayer: RxPlayer) {
    rxPlayer.addEventListener("warning", (err: any) => {
      this.retryLoadVideo();
      console.error(`RX Player video is STOPPED with following errorType: ${err.errorType}, errorStatus: ${err.status}, errorMessage: ${err.message}, errorCode: ${err.code}, url: ${err.url}`);

      this.log(this.avrVideoUrl, `RX Player video is STOPPED with following errorType: ${err.errorType}, errorStatus: ${err.status}, errorMessage: ${err.message}, errorCode: ${err.code}, url: ${err.url}`, LogType.Error, "AvrVideoStoppedWorking", true);
    });
  }


  playerStateChangeListener(rxPlayer: RxPlayer) {
    rxPlayer.addEventListener("playerStateChange", (state: string) => {
      if (state === "LOADED") {
        console.log("RX Player content is loaded");
        this.log(this.avrVideoUrl, "RX Player content is LOADED", LogType.Information);
      }
      if (state === "STOPPED") {
        this.setErrorPageOnVideo();
        console.log("RX Player content is STOPPED");
        this.log(this.avrVideoUrl, "RX Player is STOPPED", LogType.Information);
      }
      if (state === "LOADING") {
        console.log("RX Player content is LOADING...");
        this.log(this.avrVideoUrl, "RX Player content is LOADING...", LogType.Information);
      }
      if (state === "PLAYING") {
        this.unsetErrorPageOnVideo();
        console.log("RX Player content is PLAYING...");
        this.log(this.avrVideoUrl, "RX Player content is PLAYING...", LogType.Information);
        this.fillerPageService.unSetFillerPage();
      }
      if (state === "PAUSED") {
        console.log("RX Player content is PAUSED...");
        this.log(this.avrVideoUrl, "RX Player content is PAUSED...");
      }
      if (state === "BUFFERING") {
        console.log("RX Player content is BUFFERING...");
        this.log(this.avrVideoUrl, "RX Player content is BUFFERING...");
      }
      if (state === "SEEKING") {
        console.log("RX Player content is SEEKING...");
        this.log(this.avrVideoUrl, "RX Player content is SEEKING...");
      }
      if (state === "ENDED") {
        console.log("RX Player content is ENDED...");
        this.log(this.avrVideoUrl, "RX Player content is ENDED...");
      }
      if (state === "RELOADING") {
        console.log("RX Player content is RELOADING...");
        this.log(this.avrVideoUrl, "RX Player content is RELOADING...");
      }
    });
  }

  setErrorPageOnVideo() {
    this.errorService.setError("error in video");
    this.isVideoHasError = true;
  }

  unsetErrorPageOnVideo() {
    this.errorService.unSetError();
    this.isVideoHasError = false;
    this.isVideoPlaying = true;
  }

  log(url: string, message: string, level: LogType = LogType.Error, status: string = "200", fatal: boolean = false) {
    let log: Log = {
      level: level,
      message: `${url}: ${message}`,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(log);
  }
}
