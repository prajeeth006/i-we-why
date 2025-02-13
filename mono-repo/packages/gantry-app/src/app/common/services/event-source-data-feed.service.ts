import { Injectable, NgZone } from '@angular/core';

import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

import { WindowHelper } from '../helpers/window-helper/window-helper';
import { DataFeedApiNames, DataFeedAuthentication } from '../models/data-feed-authentication.model';
import { ErrorMessages } from '../models/error-messages.model';
import { ElectronParamsService } from './electron-params/electron-params.service';
import { ErrorService } from './error.service';
import { Log, LogType, LoggerService } from './logger.service';
import { DataFeedAuthenticationService } from './sse-services/data-feed-authentication.service';
import { EventSourceManager } from './sse-services/event-source-manager.service';
import { ConnectionDetails } from './sse-services/models/connection-details.model';
import { DataFeedStatus } from './sse-services/models/connecton-status-enum';

@Injectable({
    providedIn: 'root',
})
export class EventSourceDataFeedService {
    urlStaleDataMap = new Map<string, boolean>();
    apiKeyName = new BehaviorSubject<string | null>(null);

    constructor(
        private _zone: NgZone,
        private loggerService: LoggerService,
        private errorService: ErrorService,
        private eventSourceManager: EventSourceManager,
        private electronParamsService: ElectronParamsService,
        private _windowHelper: WindowHelper,
        private dataFeedAuthService: DataFeedAuthenticationService,
    ) {}

    getServerSentEvent(
        url: string,
        checkSuccessResponse: boolean = false,
        snapShotDataTimeOut: number = 2000,
        checkForSnapShot = true,
    ): Observable<any> {
        const connectionDetails = new ConnectionDetails(url, checkSuccessResponse, snapShotDataTimeOut, checkForSnapShot);

        //Timeout Timmer for Snapshot message
        connectionDetails.snapShotTimeOut = setTimeout(() => {
            this.setDFConnectionStatus(connectionDetails, DataFeedStatus.SnapShotTimeout);
        }, connectionDetails.snapShotDataTimeOut);

        this.setDFConnectionStatus(connectionDetails, DataFeedStatus.WaitingForAuthenticationKey);

        return new Observable((observer: Subscriber<string>) => {
            this.dataFeedAuthService.dataFeedAuthenticationApi$.subscribe({
                next: (authentication: DataFeedAuthentication) => {
                    let authenticationKey = authentication?.authenticationConfig[DataFeedApiNames.Default];

                    const apiKeyName = this.apiKeyName?.value;
                    const authenticationConfig = authentication?.authenticationConfig;

                    if (apiKeyName && authenticationConfig && apiKeyName in authenticationConfig) {
                        authenticationKey = authenticationConfig[apiKeyName];
                    }
                    this.setDFConnectionStatus(connectionDetails, DataFeedStatus.GotAuthenticationKey);
                    connectionDetails.authenticationKey = authenticationKey;
                    connectionDetails.pendingConnectionRetryDelay =
                        authentication.pendingConnectionRetryDelay ?? connectionDetails.pendingConnectionRetryDelay;
                    connectionDetails.failedConnectionRetryDelay =
                        authentication.failedConnectionRetryDelay ?? connectionDetails.failedConnectionRetryDelay;
                    connectionDetails.snapshotRetryDelay = authentication.snapshotRetryDelay ?? connectionDetails.snapshotRetryDelay;
                    connectionDetails.dfUrl = this.electronParamsService.addParams(url, connectionDetails?.authenticationKey);
                    connectionDetails.observer = observer;
                    this.connectToSSE(connectionDetails);
                },
                error: (error) => {
                    this.setDFConnectionStatus(connectionDetails, DataFeedStatus.DidNotGotAuthenticationKey, error);
                },
            });
        });
    }

    connectToSSE(connectionDetails: any) {
        const eventSource = new EventSource(connectionDetails.dfUrl);

        //Timeout timmer for Retry if connection is still in pending stage or waiting for snapshot more that specified time.
        connectionDetails.connectionTimeOutTimer = setTimeout(() => {
            if (connectionDetails.eventSource?.readyState == EventSource.CONNECTING) {
                this.setDFConnectionStatus(connectionDetails, DataFeedStatus.DFConnectionTimeout);
                eventSource.close();
                this.connectToSSE(connectionDetails);
            }
        }, connectionDetails.pendingConnectionRetryDelay);

        connectionDetails.snapshotRetryTimeOutTimer = setTimeout(() => {
            if (
                connectionDetails.eventSource?.readyState == EventSource.OPEN &&
                connectionDetails.checkForSnapShot &&
                !connectionDetails.snapShotReceived
            ) {
                this.setDFConnectionStatus(connectionDetails, DataFeedStatus.DFConnectionTimeout);
                eventSource.close();
                this.connectToSSE(connectionDetails);
            }
        }, connectionDetails.snapshotRetryDelay);

        this.eventSourceManager.add(eventSource);
        this.setDFConnectionStatus(connectionDetails, DataFeedStatus.WaitingForDFConnection);
        connectionDetails.eventSource = eventSource;
        eventSource.onopen = () => {
            this.setDFConnectionStatus(connectionDetails, DataFeedStatus.ConnectedToDF);
        };

        eventSource.onmessage = (event) => {
            try {
                const responseData = JSON.parse(event.data);
                const isSuccess = this.isSuccess(responseData);
                const isSnapShot = this.isSnapShotMessage(responseData);

                //Checking if it's SnapShot message or not
                if (isSnapShot) {
                    this.setDFConnectionStatus(connectionDetails, DataFeedStatus.SnapShotReceived, responseData);
                } else {
                    if (!isSuccess) {
                        this._windowHelper.raiseEventToElectron();
                        this.handleDFDataError(connectionDetails, responseData);
                        if (connectionDetails.checkSuccessResponse) {
                            this._zone.run(() => {
                                if (!(this.urlStaleDataMap.has(connectionDetails.dfUrl) && this.urlStaleDataMap.get(connectionDetails.dfUrl))) {
                                    this.errorService.setError(connectionDetails.dfUrl);
                                }
                            });
                        } else {
                            this._zone.run(() => {
                                connectionDetails.observer.next(event.data);
                            });
                        }
                    } else {
                        if (!(this.urlStaleDataMap.has(connectionDetails.dfUrl) && this.urlStaleDataMap.get(connectionDetails.dfUrl))) {
                            this.setDFConnectionStatus(connectionDetails, DataFeedStatus.HasData);
                        }
                        this.urlStaleDataMap.set(connectionDetails.dfUrl, true);
                        this._zone.run(() => {
                            connectionDetails.observer.next(event.data);
                        });
                    }
                }
            } catch (e: any) {
                this.logError(connectionDetails.dfUrl, e, '500', true);
            }
        };

        eventSource.onerror = (errorEvent: any) => {
            this.setDFConnectionStatus(connectionDetails, DataFeedStatus.DFConnectionFailed);
            if (errorEvent.currentTarget.readyState == EventSource.CLOSED) {
                if (connectionDetails.checkSuccessResponse) {
                    this._zone.run(() => {
                        if (!(this.urlStaleDataMap.has(connectionDetails.dfUrl) && this.urlStaleDataMap.get(connectionDetails.dfUrl))) {
                            this.errorService.setError(
                                'Retrying to connect DF because of Connection lost/failed/timeout with event source : ' + connectionDetails.dfUrl,
                            );
                        }
                    });
                }
                //Timeout Timmer for Retry if Connection lost if any of the reason
                setTimeout(
                    () => {
                        this.setDFConnectionStatus(connectionDetails, DataFeedStatus.DFConnectionRetrying);
                        eventSource.close();
                        this.connectToSSE(connectionDetails);
                    },
                    connectionDetails.failedConnectionRetryDelay,
                    this,
                );
            } else {
                if (connectionDetails.checkSuccessResponse) {
                    this._zone.run(() => {
                        if (!(this.urlStaleDataMap.has(connectionDetails.dfUrl) && this.urlStaleDataMap.get(connectionDetails.dfUrl))) {
                            this.errorService.setError('Connection lost/failed/timeout with event source : ' + connectionDetails.dfUrl);
                        }
                    });
                }
                this._windowHelper.raiseEventToElectron();
            }
        };
    }

    handleDFDataError(connectionDetails: any, responseData: any) {
        switch (responseData?.status) {
            case 404:
                this.urlStaleDataMap.set(connectionDetails.dfUrl, true);
                this.setDFConnectionStatus(connectionDetails, DataFeedStatus.Has404Error, responseData);
                break;
            case 403:
                this.setDFConnectionStatus(connectionDetails, DataFeedStatus.UnAuthorized, responseData);
                break;
        }
    }

    isSuccess(responseData: any) {
        return !(responseData?.status !== undefined && (responseData.status === 404 || responseData.status === 403));
    }

    isSnapShotMessage(responseData: any) {
        return !!responseData?.status && responseData.status == '600';
    }

    logError(url: string, message: string, status: string, fatal: boolean = false, logType: LogType = LogType.Error) {
        const errorLog: Log = {
            level: logType,
            message: message + ' : ' + url,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }

    setDFConnectionStatus(connectionDetails: any, dataFeedStatus: DataFeedStatus, responseData: any = undefined) {
        switch (dataFeedStatus) {
            case DataFeedStatus.WaitingForAuthenticationKey:
                connectionDetails.connectionStatus = DataFeedStatus.WaitingForAuthenticationKey;
                this.logError(connectionDetails.dfUrl, 'Waiting for AuthenticationKey', 'ConnectionStatus', false, LogType.Information);
                console.info(DataFeedStatus[dataFeedStatus], connectionDetails.dfUrl);
                break;

            case DataFeedStatus.GotAuthenticationKey:
                connectionDetails.connectionStatus = DataFeedStatus.GotAuthenticationKey;
                this.logError(connectionDetails.dfUrl, 'Got AuthenticationKey', 'ConnectionStatus', false, LogType.Information);
                console.info(DataFeedStatus[dataFeedStatus], connectionDetails.dfUrl);
                break;

            case DataFeedStatus.DidNotGotAuthenticationKey:
                connectionDetails.connectionStatus = DataFeedStatus.DidNotGotAuthenticationKey;
                this.logError(connectionDetails.dfUrl, 'Unable to Got AuthenticationKey : ' + responseData, '-1', false, LogType.Error);
                console.error(DataFeedStatus[dataFeedStatus], connectionDetails.dfUrl, 'Unable to Got AuthenticationKey : ' + responseData);
                break;

            case DataFeedStatus.WaitingForDFConnection:
                connectionDetails.connectionStatus = DataFeedStatus.WaitingForDFConnection;
                this.logError(connectionDetails.dfUrl, 'Waiting for DF connection', 'ConnectionStatus', false, LogType.Information);
                console.info(DataFeedStatus[dataFeedStatus], connectionDetails.dfUrl);
                break;

            case DataFeedStatus.ConnectedToDF:
                connectionDetails.isDFConnectionEstablished = true;
                connectionDetails.connectionStatus = DataFeedStatus.ConnectedToDF;
                this.logError(connectionDetails.dfUrl, 'Connected Established to DF', 'ConnectionStatus', false, LogType.Information);
                console.info(DataFeedStatus[dataFeedStatus], connectionDetails.dfUrl);
                if (!connectionDetails.checkForSnapShot && connectionDetails.checkSuccessResponse) {
                    this.errorService.unSetError();
                }
                break;

            case DataFeedStatus.DFConnectionFailed:
                connectionDetails.connectionStatus = DataFeedStatus.DFConnectionFailed;
                if (connectionDetails.has404Error) {
                    console.error(ErrorMessages.DataFeedError, connectionDetails.dfUrl);
                    this.logError(connectionDetails.dfUrl, ErrorMessages.DataFeedError, '404', true);
                    if (connectionDetails.checkSuccessResponse && !connectionDetails.snapShotReceived) {
                        this.errorService.setError('Data not found : ' + connectionDetails.dfUrl);
                    }
                } else {
                    this.logError(connectionDetails.dfUrl, 'Connection lost/failed/timeout with event source', '-1');
                    console.error('Connection lost/failed/timeout with event source' + connectionDetails.dfUrl);
                }
                break;

            case DataFeedStatus.DFConnectionTimeout:
                if (connectionDetails.eventSource?.readyState == EventSource.CONNECTING) {
                    connectionDetails.connectionStatus = DataFeedStatus.DFConnectionTimeout;
                    this.logError(
                        connectionDetails.dfUrl,
                        'Retrying to connect DF because of Connection not established with DF with in ' +
                            connectionDetails.pendingConnectionRetryDelay +
                            ' Retrying to connect DF',
                        'ConnectionStatus',
                        false,
                        LogType.Information,
                    );
                    console.info(
                        'Retrying to connect DF because of Connection not established with DF with in ' +
                            connectionDetails.pendingConnectionRetryDelay +
                            ' Retrying to connect DF',
                        connectionDetails.dfUrl,
                    );
                    if (connectionDetails.checkSuccessResponse && !connectionDetails.snapShotReceived) {
                        this.errorService.setError(
                            'Retrying to connect DF because of Connection not established with DF within ' +
                                connectionDetails.pendingConnectionRetryDelay +
                                ' : ' +
                                connectionDetails.dfUrl,
                        );
                    }
                }
                break;

            case DataFeedStatus.DFConnectionRetrying:
                connectionDetails.connectionStatus = DataFeedStatus.DFConnectionRetrying;
                this.logError(connectionDetails.dfUrl, 'Retrying to Connecing DF', 'ConnectionStatus', false, LogType.Information);
                console.info(DataFeedStatus[dataFeedStatus], connectionDetails.dfUrl);
                break;

            case DataFeedStatus.Has404Error:
                connectionDetails.has404Error = true;
                console.error(ErrorMessages.DataFeedError, connectionDetails.dfUrl);
                this.logError(connectionDetails.dfUrl, ErrorMessages.DataFeedError, responseData?.status, true);
                if (connectionDetails.checkSuccessResponse && !connectionDetails.snapShotReceived) {
                    this.errorService.setError('Data not found : ' + connectionDetails.dfUrl);
                }
                return;

            case DataFeedStatus.UnAuthorized:
                console.error("UnAuthorized can't be accessed : ", connectionDetails.dfUrl);
                this.logError(connectionDetails.dfUrl, "UnAuthorized can't be accessed", responseData?.status, true);
                if (connectionDetails.checkSuccessResponse && !connectionDetails.snapShotReceived) {
                    this.errorService.setError("UnAuthorized can't be accessed : " + connectionDetails.dfUrl);
                }
                return;

            case DataFeedStatus.HasData:
                connectionDetails.has404Error = false;
                connectionDetails.connectionStatus = DataFeedStatus.HasData;
                break;

            case DataFeedStatus.SnapShotReceived:
                if (connectionDetails.checkForSnapShot) {
                    this.errorService.isSnapshotDataAvailable.set(connectionDetails.dfUrl, true);
                    this.errorService.unSetError();
                }
                connectionDetails.snapShotTimeOut = undefined;
                connectionDetails.isSnapShotTimeOut = true;
                clearTimeout(connectionDetails.snapShotTimeOut);
                connectionDetails.connectionStatus = DataFeedStatus.SnapShotReceived;
                const requestEndedAt: number = Date.now();
                if (!connectionDetails.snapShotReceived) {
                    this.logError(
                        connectionDetails.dfUrl,
                        'Snapshot message received after ' + (requestEndedAt - connectionDetails.requestStartedAt) + ' Milliseconds.',
                        'ConnectionStatus',
                        true,
                        LogType.Information,
                    );
                    console.info(
                        'SnapShot message received after ' + (requestEndedAt - connectionDetails.requestStartedAt) + ' : ',
                        responseData,
                        connectionDetails.dfUrl,
                        this.errorService.isSnapshotDataAvailable,
                    );
                }
                connectionDetails.snapShotReceived = true;
                break;
            case DataFeedStatus.SnapShotTimeout:
                connectionDetails.snapShotTimeOut = undefined;
                connectionDetails.isSnapShotTimeOut = true;
                break;
            default:
                connectionDetails.connectionStatus = dataFeedStatus;
                break;
        }

        this.setDFErrorStatus(connectionDetails);
    }

    setDFErrorStatus(connectionDetails: any) {
        if (connectionDetails.isSnapShotTimeOut) {
            if (!connectionDetails.authenticationKey) {
                console.error('Waiting to get Authentication key : ', connectionDetails.dfUrl);
                this.errorService.setError('Waiting to get Authentication key : ' + connectionDetails.dfUrl);
                this.logError(connectionDetails.dfUrl, 'Waiting to get Authentication key', '-1', true);
            } else if (
                connectionDetails.checkSuccessResponse &&
                connectionDetails.connectionStatus != DataFeedStatus.DFConnectionFailed &&
                connectionDetails.connectionStatus != DataFeedStatus.ConnectedToDF &&
                !connectionDetails.has404Error &&
                !connectionDetails.isDFConnectionEstablished &&
                !connectionDetails.snapShotReceived
            ) {
                console.error('Waiting for connection to DF: ', connectionDetails.dfUrl);
                this.errorService.setError('Waiting for connection  to DF: ' + connectionDetails.dfUrl);
                this.logError(connectionDetails.dfUrl, 'Waiting for connection to DF', '-1', true);
            } else if (
                connectionDetails.checkForSnapShot &&
                connectionDetails.connectionStatus != DataFeedStatus.DFConnectionFailed &&
                !connectionDetails.has404Error &&
                !connectionDetails.snapShotReceived
            ) {
                console.error(
                    'Snapshot data not received with in ' + connectionDetails.snapShotDataTimeOut + ' Milliseconds.',
                    connectionDetails.dfUrl,
                );
                this.errorService.setError('Waiting for Snapshot data  : ' + connectionDetails.dfUrl);
                this.logError(
                    connectionDetails.dfUrl,
                    'Snapshot data not received with in ' + connectionDetails.snapShotDataTimeOut + ' Milliseconds.',
                    '-1',
                    true,
                );
                this.errorService.isSnapshotDataAvailable.set(connectionDetails.dfUrl, false);
            }
        }
    }
}
