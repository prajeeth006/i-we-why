import { Subscriber } from 'rxjs';

import { DataFeedStatus } from './connecton-status-enum';

export class ConnectionDetails {
    dfUrl: string;
    checkSuccessResponse: boolean;
    snapShotDataTimeOut: number = 2000;
    checkForSnapShot: boolean;
    requestStartedAt: number = Date.now();
    connectionStatus: number = DataFeedStatus.RequestedAuthenticationKey;

    authenticationKey: string;
    isDFConnectionEstablished: boolean = false;
    snapShotReceived: boolean = false;

    isSnapShotTimeOut: boolean = false;
    has404Error: boolean = false;
    snapShotTimeOut: NodeJS.Timeout | null | undefined;
    connectionTimeOutTimer: string | null | undefined;
    snapshotRetryTimeOutTimer: string | null | undefined;
    pendingConnectionRetryDelay: number = 10000;
    failedConnectionRetryDelay: number = 30000;
    snapshotRetryDelay: number = 20000;

    observer: Subscriber<string> | null | undefined;
    eventSource: EventSource | null | undefined;

    constructor(url: string, checkSuccessResponse: boolean = false, snapShotDataTimeOut: number = 2000, checkForSnapShot = true) {
        this.dfUrl = url;
        this.checkSuccessResponse = checkSuccessResponse;
        this.snapShotDataTimeOut = snapShotDataTimeOut == 0 ? 2000 : snapShotDataTimeOut;
        this.checkForSnapShot = checkForSnapShot;
    }
}
