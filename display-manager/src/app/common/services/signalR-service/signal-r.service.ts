import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigItem, LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Log, LogType, LoggerService } from '../logger-service/logger.service';
import { Domains } from '../../models/labels.const';
import { SitecoreItemRoot } from './signal-r.model';
import { ApiService } from '../../api.service';
import { SignalrParamsService } from './signalr-params/signalr-params.service';

export interface SignalRConfigItem {
  signalRHubMessageApi: string;
  retryConnectionTime: number;
  isRealTimeUpdatesEnabled: boolean;
  realTimeEventsTracker: string;
}

export interface SignalRQueryParams {
  itemPath: string;
  labelName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private connection: signalR.HubConnection;
  public signalRMessage$: BehaviorSubject<SitecoreItemRoot> = new BehaviorSubject<any>(null);
  public signalRConfig$: ReplaySubject<SignalRConfigItem> = new ReplaySubject<SignalRConfigItem>(1);
  private signalRUrl: string;
  private retryConnectionTime: number;
  private reStartConnectionId: NodeJS.Timeout;
  private signalRConnetionId: NodeJS.Timeout;

  constructor(
    private labelSelectorService: LabelSelectorService,
    private loggerService: LoggerService,
    private apiService: ApiService,
    private signalrParamsService: SignalrParamsService
  ) {
  }

  public loadSignalRConfig() {
    this.apiService.get<SignalRConfigItem>('/sitecore/api/displayManager/getSignalRConfiguration').subscribe((signalRconfig: SignalRConfigItem) => {
      if (!!signalRconfig) {
        this.signalRConfig$.next(signalRconfig);
        this.retryConnectionTime = signalRconfig?.retryConnectionTime ?? 5000;
        if (signalRconfig?.isRealTimeUpdatesEnabled) {
          this.log("Real Time Updates status : Enabled");
          this.initialize(signalRconfig);
        } else {
          this.log("Real Time Updates status : Disabled");
        }
      }
    }),
    (error: any) => this.log(`Failed to load SignalR config: ${error}`, LogType.Error)
  }

  private initialize(signalRconfig: SignalRConfigItem) {
    this.labelSelectorService.configItemValues$.subscribe((configItem: ConfigItem) => {
      let coralLabel = configItem?.labels?.split("|")[0]?.trim()?.toLowerCase();
      this.prepareSignalRUrlAndInitialize(signalRconfig, coralLabel);
    })
  }

  private prepareSignalRUrlAndInitialize(signalRconfig: SignalRConfigItem, coralLabel: string) {
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      const signalRUrlQueryParams = this.getSignalRUrlQueryParams(signalRconfig, currentLabel, coralLabel);

      if (!!signalRUrlQueryParams.labelName && !!signalRUrlQueryParams.itemPath) {
        this.log(`SignalR => label : ${signalRUrlQueryParams.labelName}, itemPath : ${signalRUrlQueryParams.itemPath} provided`, LogType.Information);
        this.signalRUrl = this.signalrParamsService.addParams(signalRconfig.signalRHubMessageApi, signalRUrlQueryParams);
        this.setTimeOutOnSignalRConnectionState();
        this.initiateSignalRConnection();
      } else {
        this.log(`SignalR URL error : Invalid label : ${signalRUrlQueryParams.labelName} or itemPath : ${signalRUrlQueryParams.itemPath} provided`, LogType.Error, "SignalR Error", true);
      }
    })
  }

  private initiateSignalRConnection() {
    try {
      if (!!this.connection) {
        this.stopConnection();
      }
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.signalRUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .build();

      this.addConnectionHandlers();
      this.startConnection();
    }
    catch (error) {
      this.log(`SignalR connection error : ${error} , Connection state : ${this.connection.state}`, LogType.Error, "SignalR Error", false);
    }
  }

  private addConnectionHandlers() {
    if (!this.connection) return;

    // signalR error handler
    this.connection.onclose((error: any) => {
      if (!!error) {
        this.log("SignalR connection: Closed with error" + error, LogType.Error, "SignalR Error", true);
      }
      
      if(this.connection.state === signalR.HubConnectionState.Disconnected){
        this.restartConnection();
      }
    });

    this.connection.onreconnected(() => {
      this.log('SignalR Connection: Reconnected', LogType.Information);
    });

    this.connection.onreconnecting(() => {
      this.log('SignalR Connection: Reconnecting...', LogType.Information);
    });
  }

  private startConnection() {
    if (this.connection.state === signalR.HubConnectionState.Connected) return;

    this.connection.start()
      .then((s: any) => {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
          this.log("SignalR Connection : Started", LogType.Information);
        }
        this.subscribeToServerEvents();
      })
      .catch((error: any) => {
        this.log(`SignalR connection error : ${error} , Connection state : ${this.connection.state}`, LogType.Error, "SignalR Error", false);
        this.restartConnection();
      });
  }

  private setTimeOutOnSignalRConnectionState() {
    this.signalRConnetionId = setTimeout(() => {
      clearTimeout(this.signalRConnetionId);
      if (this.connection.state !== signalR.HubConnectionState.Connected) {
        const signalRConnectionMessage = `SignalR connection still pending. Connection state : ${this.connection.state}`;
        this.log(signalRConnectionMessage, LogType.Error, "SignalR Error", false);
      }
    }, this.retryConnectionTime);
  }

  private restartConnection() {
    this.reStartConnectionId = setTimeout(() => {
      clearTimeout(this.reStartConnectionId);
      this.log("SignalR Connection : Restarting");
      this.startConnection()
    }, this.retryConnectionTime);
  }

  private stopConnection() {
    this.connection.stop()
    .then(() => {
      this.log("SignalR Connection : Stopped");
    });
  }

  private subscribeToServerEvents(): void {
    this.connection.on('UpdateItemChanges', (itemData: string, itemId: string) => {

      if (itemId != '0' && !!itemData && itemData !== '{}') {
        this.parseSignalRMessage(itemData);
      } else {
        let signalRErrorMsg = `Didn't got data from sitecore as itemId returned is ${itemId}, Please check itemId passed in URL present in sitecore or not, it should be published to Web DB as well. Inform d.dtp.cms if you think everything is fine from content perspective.`;
        this.log(signalRErrorMsg, LogType.Error, 'NA', true);
      }
    });

  }

  private parseSignalRMessage(signalRMessage: string) {
    try {
      let sitecoreItemRoot: SitecoreItemRoot = JSON.parse(signalRMessage);
      this.signalRMessage$.next(sitecoreItemRoot);
    } catch (e) {
      this.log(`Error in parsing signalRMesssage: ${e},Please Inform d.dtp.cms.`, LogType.Error, 'NA', true);
    }
  }

  private getSignalRUrlQueryParams(signalRconfig: SignalRConfigItem, currentLabel: string, coralLabel: string): SignalRQueryParams {
    let itemPath = signalRconfig?.realTimeEventsTracker;
    let labelName = currentLabel?.toLowerCase() === coralLabel ? Domains.coral : Domains.ladbrokes;
    return { itemPath, labelName };
  }

  log(message: string, level: LogType = LogType.Error, status: string = 'NA', fatal: boolean = false) {
    let log: Log = {
      level: level,
      message: `[signalr-log]: ${message}`,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(log);
  }
}
