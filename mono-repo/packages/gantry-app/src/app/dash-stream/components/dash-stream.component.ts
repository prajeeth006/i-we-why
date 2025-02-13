import { Component, ElementRef, ViewChild } from '@angular/core';

import RxPlayer from 'rx-player';

import { FillerPageService } from '../../common/components/filler-page/services/filler-page.service';
import { ErrorService } from '../../common/services/error.service';
import { Log, LogType, LoggerService } from '../../common/services/logger.service';
import { RouteDataService } from '../../common/services/route-data.service';

RxPlayer.LogLevel = 'DEBUG';

@Component({
    selector: 'gn-dash-stream',
    templateUrl: './dash-stream.component.html',
    styleUrl: './dash-stream.component.scss',
})
export class DashStreamComponent {
    errorMessage$ = this.errorService.errorMessage$;
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
    dashStreamUrl: string;
    rxPlayer: RxPlayer;
    maxRetryCount: number = 29;
    retryCount: number = 0;
    timeout: NodeJS.Timeout;
    isRetryCalled = false;
    isVideoHasError: boolean = false;

    @ViewChild('dashStream') dashStreamRef!: ElementRef;

    constructor(
        private routeDataService: RouteDataService,
        private loggerService: LoggerService,
        private errorService: ErrorService,
        private fillerPageService: FillerPageService,
    ) {
        this.fillerPageService.setFillerPage('LOADING');
    }

    ngOnDestroy(): void {
        this.rxPlayer?.dispose();
        this.unsetErrorPageOnVideo();
        clearTimeout(this.timeout);
    }

    ngAfterViewInit() {
        this.dashStreamUrl = this.routeDataService.getQueryParams()['url'];
        if (!!this.dashStreamUrl) {
            this.loadVideo();
        } else {
            setTimeout(() => {
                this.setErrorPageOnVideo('Dash Stream URL not provided');
                this.fillerPageService.unSetFillerPage();
            }, 0);
        }
    }

    loadVideo() {
        try {
            console.log(`Load video called retry count: ${this.retryCount}, maxretrycount: ${this.maxRetryCount}`);
            this.rxPlayer?.dispose();
            this.rxPlayer = new RxPlayer({
                videoElement: this.dashStreamRef.nativeElement,
            });

            this.rxPlayer.loadVideo({
                url: this.dashStreamUrl,
                transport: 'dash',
                autoPlay: true,
                lowLatencyMode: true,
                networkConfig: {
                    manifestRetry: this.maxRetryCount,
                    segmentRetry: this.maxRetryCount,
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
            this.log(
                this.dashStreamUrl,
                `ERROR in Loading video in RX Player where ERROR Message is ${err?.message}, Error : ${err}`,
                LogType.Error,
                'DashStreamStoppedWorking',
                true,
            );
        }
    }

    errorEventListener(rxPlayer: RxPlayer) {
        rxPlayer.addEventListener('error', (err: any) => {
            this.retryLoadVideo();
            console.error(`RX Player video is STOPPED with following errorMessage: ${err.message}, errorCode: ${err.code}`);

            this.log(
                this.dashStreamUrl,
                `RX Player video is STOPPED with following errorMessage: ${err.message}, errorCode: ${err.code}`,
                LogType.Error,
                'DashStreamStoppedWorking',
                true,
            );
        });
    }

    retryLoadVideo() {
        this.fillerPageService.unSetFillerPage();
        if (!this.isRetryCalled) {
            this.isRetryCalled = true;
            this.timeout = setTimeout(() => {
                if (this.retryCount <= this.maxRetryCount) {
                    this.isRetryCalled = false;
                    ++this.retryCount;
                    this.loadVideo();
                } else {
                    this.isRetryCalled = false;
                    this.loadVideo();
                }
            }, 1000 * this.retryCount);
        }
    }

    warningEventListener(rxPlayer: RxPlayer) {
        rxPlayer.addEventListener('warning', (err: any) => {
            this.retryLoadVideo();
            console.error(`RX Player video is STOPPED with following errorMessage: ${err.message}, errorCode: ${err.code}`);

            this.log(
                this.dashStreamUrl,
                `RX Player video is STOPPED with following errorMessage: ${err.message}, errorCode: ${err.code}`,
                LogType.Error,
                'DashStreamStoppedWorking',
                true,
            );
        });
    }

    playerStateChangeListener(rxPlayer: RxPlayer) {
        rxPlayer.addEventListener('playerStateChange', (state: string) => {
            if (state === 'LOADED') {
                console.log('[DashStream]: RX Player content is loaded');
                this.log(this.dashStreamUrl, 'RX Player content is LOADED', LogType.Information);
            }
            if (state === 'STOPPED') {
                this.setErrorPageOnVideo();
                console.log('[DashStream]: RX Player content is STOPPED');
                this.log(this.dashStreamUrl, 'RX Player is STOPPED', LogType.Information);
            }
            if (state === 'LOADING') {
                console.log('[DashStream]: RX Player content is LOADING...');
                this.log(this.dashStreamUrl, 'RX Player content is LOADING...', LogType.Information);
            }
            if (state === 'PLAYING') {
                this.unsetErrorPageOnVideo();
                console.log('[DashStream]: RX Player content is PLAYING...');
                this.log(this.dashStreamUrl, 'RX Player content is PLAYING...', LogType.Information);
                this.fillerPageService.unSetFillerPage();
            }
            if (state === 'PAUSED') {
                console.log('[DashStream]: RX Player content is PAUSED...');
                this.log(this.dashStreamUrl, 'RX Player content is PAUSED...');
            }
            if (state === 'BUFFERING') {
                console.log('[DashStream]: RX Player content is BUFFERING...');
                this.log(this.dashStreamUrl, 'RX Player content is BUFFERING...');
            }
            if (state === 'SEEKING') {
                console.log('[DashStream]: RX Player content is SEEKING...');
                this.log(this.dashStreamUrl, 'RX Player content is SEEKING...');
            }
            if (state === 'ENDED') {
                console.log('[DashStream]: RX Player content is ENDED...');
                this.log(this.dashStreamUrl, 'RX Player content is ENDED...');
            }
            if (state === 'RELOADING') {
                console.log('[DashStream]: RX Player content is RELOADING...');
                this.log(this.dashStreamUrl, 'RX Player content is RELOADING...');
            }
        });
    }

    setErrorPageOnVideo(errorMsg: string = 'error in video') {
        this.errorService.setError(errorMsg);
        this.isVideoHasError = true;
    }

    unsetErrorPageOnVideo() {
        this.errorService.unSetError();
        this.isVideoHasError = false;
    }

    log(url: string, message: string, level: LogType = LogType.Error, status: string = '200', fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${url}: [DashStream]: ${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }
}
