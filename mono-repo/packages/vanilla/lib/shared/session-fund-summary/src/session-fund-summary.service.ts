import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SessionFundSummary } from './session-fund-summary.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class SessionFundSummaryService {
    private sessionFundSummaryEvents = new BehaviorSubject<SessionFundSummary | null>(null);

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    get getSummary(): Observable<SessionFundSummary | null> {
        return this.sessionFundSummaryEvents;
    }

    refresh(): Promise<SessionFundSummary | null> {
        if (!this.user.isAuthenticated) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            this.apiService.get('sessionfundsummary').subscribe((summary: SessionFundSummary) => {
                this.sessionFundSummaryEvents.next(summary);
                resolve(summary);
            });
        });
    }
}
