import { Injectable } from '@angular/core';

import { MessageEnvelope, SubscriptionRequest } from '@cds/push';
import { ClientConnector, ConnectionStatus, ConnectorSettings } from 'cds-client';
import { BehaviorSubject, Observable, Subject, shareReplay } from 'rxjs';

import { ErrorService } from '../services/error.service';
import { HttpService } from '../services/http.service';
import { CDSPushConnectionConfig } from './models/cds-push-config.model';

@Injectable({
    providedIn: 'root',
})
export class CdsPushProvider {
    private cdsPushWebsocketConnectionId: NodeJS.Timeout;
    private connection: ClientConnector;
    private _messageReceived$ = new Subject<MessageEnvelope>();
    public onConnectionEstablished = new BehaviorSubject<boolean>(false);
    private providerOptions: ConnectorSettings;
    get messageReceived$(): Observable<MessageEnvelope> {
        return this._messageReceived$.asObservable();
    }
    messages: string[] = [];
    cdsPushConnectionConfig: CDSPushConnectionConfig;

    constructor(
        private httpService: HttpService,
        private errorService: ErrorService,
    ) {
        this.start();
    }

    public async start(): Promise<void> {
        this.getCDSPushConfig().subscribe((connectionConfig) => {
            this.cdsPushConnectionConfig = connectionConfig;
            this.cdsConnectionStart(connectionConfig);
        });
    }
    async subscribe(subscriptionRequest: SubscriptionRequest): Promise<void> {
        await this.connection?.subscribe(subscriptionRequest);
    }

    async cancelSubscription(request: SubscriptionRequest): Promise<void> {
        await this.connection?.cancelSubscription(request);
    }

    async restart(): Promise<void> {
        await this.connection.stop();
        await this.start();
    }

    get isConnected(): boolean {
        return this.connection.getStatus() === ConnectionStatus.Connected;
    }

    get isDisconnected(): boolean {
        return this.connection.getStatus() === ConnectionStatus.Disconnected;
    }

    private onMessageReceived = (message: MessageEnvelope) => {
        this._messageReceived$.next(message);
    };

    private onStatusChanged = (status: ConnectionStatus) => {
        if (status === ConnectionStatus.Connected) {
            console.log('Connection is established ' + status);
            this.onConnectionEstablished.next(true);
        } else if (status == ConnectionStatus.Disconnected) {
            console.log('Connection is Disconnected!!');
            this.errorService.logError('Web Socket Connection is failed for the url : ' + this.cdsPushConnectionConfig?.pushUrl);
            this.retryConnection();
        }
    };

    private getCDSPushConfig(): Observable<CDSPushConnectionConfig> {
        return this.httpService.get<CDSPushConnectionConfig>('en/api/getCDSPushConfig').pipe(shareReplay());
    }

    private retryConnection() {
        this.cdsPushWebsocketConnectionId = setTimeout(() => {
            this.errorService.logError('Retrying to start the connection back!!');
            clearTimeout(this.cdsPushWebsocketConnectionId);
            this.startConnection();
        }, this.cdsPushConnectionConfig.pushCdsRetryDelay);
    }

    private startConnection() {
        this.connection
            ?.start()
            .then(() => {})
            .catch((error) => this.errorService.logError(error));
    }

    private cdsConnectionStart(connectionConfig: CDSPushConnectionConfig) {
        this.providerOptions = {
            url: connectionConfig.pushUrl,
            accessId: connectionConfig.pushAccessId,
            lang: connectionConfig.lang,
            country: connectionConfig.userCountry,
            maxRetries: connectionConfig.maxRetries,
            skipNegotiation: connectionConfig.skipNegotiation,
            prefferedTransportType: connectionConfig.prefferedTransportType,
            appUpdates: connectionConfig.isMainToLiveTransitionEnabled,
        };
        this.connection = new ClientConnector(this.providerOptions, this.onMessageReceived, this.onStatusChanged);

        this.startConnection();
    }
}
