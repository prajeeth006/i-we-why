export class DataFeedAuthentication {
    authenticationKey: string = null;
    failedConnectionRetryDelay: number = 30000;
    pendingConnectionRetryDelay: number = 10000;
    snapshotRetryDelay: number = 20000;
}