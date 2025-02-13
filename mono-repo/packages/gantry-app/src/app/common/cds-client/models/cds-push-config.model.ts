import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CDSPushConnectionConfig {
    pushAccessId: string;
    pushUrl: string;
    maxRetries: number;
    prefferedTransportType: number = 1;
    skipNegotiation: boolean;
    lang: string;
    userCountry: string;
    isMainToLiveTransitionEnabled: boolean;
    pushCdsRetryDelay: number;
}
