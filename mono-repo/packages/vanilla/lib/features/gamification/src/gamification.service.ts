import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface CoinsBalance {
    balance: string;
    status: number;
    statusCode: number;
    statusMessage: number;
    additionalAttribs: number;
    productBalances: number;
}

@Injectable({
    providedIn: 'root',
})
export class GamificationService {
    isLoaded: boolean = false;

    private coinBalanceEvents = new ReplaySubject<CoinsBalance>(1);
    get coinBalance(): Observable<CoinsBalance> {
        return this.coinBalanceEvents;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    load() {
        this.apiService.get('gamification').subscribe((response) => {
            this.coinBalanceEvents.next(response);
            this.isLoaded = true;
        });
    }
}
