import { Injectable } from '@angular/core';

import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

import { EventFeedApiUrls } from '../models/event-feed-api-urls.model';
import { ErrorService } from '../services/error.service';
import { EventFeedUrlService } from '../services/event-feed-url.service';
import { Log, LogType, LoggerService } from '../services/logger.service';
import { RouteDataService } from '../services/route-data.service';
import { SitecoreItemRoot } from './models/signalRMessage';
import { SignalRParamsService } from './signalr-params/signal-rparams.service';

declare global {
    interface Window {
        label: string;
    }
}

/* To Utilize this Service import in Constructor and get the value as below
hubSingleRMessage$ = this.signalr.hubSingleRMessage;
*/
@Injectable({
    providedIn: 'root',
})
export class SignalrService {
    connection: any;
    hubSingleRMessage$: BehaviorSubject<any>;
    signalRUrl: string;
    reStartConnectionId: NodeJS.Timeout;
    signalRConnetionId: NodeJS.Timeout;
    retryConnectionTime: number;

    constructor(
        private loggerService: LoggerService,
        private eventFeedUrlService: EventFeedUrlService,
        private routeDataService: RouteDataService,
        private errorService: ErrorService,
        private signalRParamsService: SignalRParamsService,
    ) {
        this.hubSingleRMessage$ = new BehaviorSubject<any>(null);
        this.eventFeedUrlService.eventFeedApiUrls$.subscribe((eventFeedApiUrls: EventFeedApiUrls) => {
            this.retryConnectionTime = eventFeedApiUrls.signalrRetryTimeOnDisconnect;
            const queryParams = this.routeDataService.getQueryParams();
            if (!!window['label'] && !!queryParams['contentItemId']) {
                this.signalRUrl = this.signalRParamsService.addParams(eventFeedApiUrls.signalRHubMessageApi, {
                    itemID: queryParams['contentItemId'],
                    labelName: window['label'],
                });

                this.setTimeOutOnSignalRConnectionState();
                this.initiateSignalrConnection();
            } else {
                this.log('SignalR URL error : Invalid label or contentItemId provided', LogType.Error, 'SignalR Error', true);
                this.setSignalRErrorStatus('Invalid label or contentItemId provided');
            }
        });
    }

    setTimeOutOnSignalRConnectionState() {
        this.signalRConnetionId = setTimeout(() => {
            clearTimeout(this.signalRConnetionId);
            if (!!this.connection && this.connection?.state !== signalR.HubConnectionState.Connected) {
                const signalRConnectionMessage = `SignalR connection still pending. Connection Status is ${this.connection.state}`;
                this.log(signalRConnectionMessage, LogType.Error, 'SignalR Error', true);
                this.setSignalRErrorStatus(signalRConnectionMessage);
            }
        }, this.retryConnectionTime);
    }

    setSignalRErrorStatus(error: any = null) {
        if (!error) {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        } else {
            this.errorService.setError(error);
        }
    }

    startConnection() {
        this.connection
            .start()
            .then(() => {
                console.log('SignalR Connection : Started');
                this.setSignalRErrorStatus();
                this.subscribeToServerEvents();
            })
            .catch((error: any) => {
                this.setSignalRErrorStatus(error);
                this.log('SignalR connection error : ' + error, LogType.Error, 'SignalR Error', true);
                this.restartConnection();
            });
    }

    restartConnection() {
        this.reStartConnectionId = setTimeout(() => {
            clearTimeout(this.reStartConnectionId);
            this.startConnection();
        }, this.retryConnectionTime);
    }

    stopConnection() {
        this.connection.stop().then(() => {
            console.log('SignalR Connection : Stopped');
            this.restartConnection();
        });
    }

    initiateSignalrConnection() {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(this.signalRUrl, {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .build();

            // signalR error handler
            this.connection.onclose((error: any) => {
                if (error) {
                    this.log('SignalR connection error : ' + error, LogType.Error, 'SignalR Error', true);
                    this.setSignalRErrorStatus(error);
                    this.stopConnection();
                }
            });

            this.startConnection();
        } catch (error) {
            this.log('SignalR connection error : ' + error, LogType.Error, 'SignalR Error', true);
            this.setSignalRErrorStatus(error);
            if (this.connection) {
                this.stopConnection();
            } else {
                this.restartConnection();
            }
        }
    }

    subscribeToServerEvents(): void {
        this.connection.on('UpdateItemChanges', (itemData: string, itemId: string) => {
            if (itemId != '0' && !!itemData && itemData != '{}') {
                this.parseSignalRMessage(itemData);
            } else {
                const signalRErrorMsg = `Didn't got data from sitecore as itemId returned is ${itemId}, Please check itemId passed in URL present in sitecore or not, it should be published to Web DB as well. Inform d.dtp.cms if you think everything is fine from content perspective.`;
                this.log(signalRErrorMsg, LogType.Error, 'NA', true);
                this.setSignalRErrorStatus(signalRErrorMsg);
            }
        });
    }

    parseSignalRMessage(signalRMessage: string) {
        try {
            const sitecoreItemRoot: SitecoreItemRoot = JSON.parse(signalRMessage);
            const eventFormData: string = 'eventformdata';
            const formData = sitecoreItemRoot?.Item?.Fields?.find((x: any) => x.Key == eventFormData)?.Content;
            if (!!formData && formData != '{}') {
                try {
                    const parsedFormData = JSON.parse(formData);
                    this.hubSingleRMessage$.next(parsedFormData);
                    this.setSignalRErrorStatus();
                } catch (e) {
                    const errorMsg = `Parsing of the content failed. Please check content in this itemId :${sitecoreItemRoot.Item.Id}, it should be of type ManualGreyhoundRacingTemplateResult`;
                    this.log(errorMsg, LogType.Error, 'Parsing Error', true);
                    this.setSignalRErrorStatus(errorMsg);
                }
            } else {
                const errorMsg = `There is no content found under this itemId :${sitecoreItemRoot.Item.Id} for this field ${eventFormData}, please check in sitecore `;
                this.log(errorMsg, LogType.Error, 'NA', true);
                this.setSignalRErrorStatus(errorMsg);
            }
        } catch (e) {
            this.log(`Error in parsing signalRMesssage: ${e},Please Inform d.dtp.cms.`, LogType.Error, 'NA', true);
            this.setSignalRErrorStatus(e);
        }
    }

    log(message: string, level: LogType = LogType.Error, status: string, fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }
}
