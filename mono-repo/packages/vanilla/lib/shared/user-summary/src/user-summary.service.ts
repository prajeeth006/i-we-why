import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @stable
 */
export interface UserSummary {
    isEnabled: boolean;
    profit: number;
    loss: number;
    netProfit: number;
    netLoss: number;
    totalDepositamount: number;
    totalWithdrawalamount: number;
    casinoTaxCollected: number;
    pokerTaxCollected: number;
    sportsTaxCollected: number;
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class UserSummaryService {
    private userSummaryEvents = new BehaviorSubject<UserSummary | null>(null);

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    getSummary(): Observable<UserSummary | null> {
        return this.userSummaryEvents;
    }

    refresh(): Promise<UserSummary | null> {
        if (!this.user.isAuthenticated) {
            return Promise.resolve(null);
        }
        return new Promise((resolve) => {
            this.apiService.get('usersummary').subscribe((summary: UserSummary) => {
                this.userSummaryEvents.next(summary);
                resolve(summary);
            });
        });
    }
}
