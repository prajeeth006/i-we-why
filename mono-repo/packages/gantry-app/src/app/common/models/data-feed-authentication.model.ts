export class DataFeedAuthentication {
    authenticationConfig: AuthenticationConfig;
    authenticationKey: string | null | undefined;
    failedConnectionRetryDelay: number = 30000;
    pendingConnectionRetryDelay: number = 10000;
    snapshotRetryDelay: number = 20000;
}
export interface AuthenticationConfig {
    [key: string]: string;
}

export enum DataFeedApiNames {
    AvrApi = 'avrApi',
    Default = 'default',
}
