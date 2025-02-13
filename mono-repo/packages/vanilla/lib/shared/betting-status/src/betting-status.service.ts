import { Injectable, inject } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BettingStatus {
    hasBets: boolean;
}

/**
 * @experimental
 *
 * @description Fetch and refresh betting status data.
 */
@Injectable({
    providedIn: 'root',
})
export class BettingStatusService {
    private user = inject(UserService);
    private apiService = inject(SharedFeaturesApiService);

    private loaded = false;
    private events = new BehaviorSubject<BettingStatus | null>(null);

    get bettingStatus(): Observable<BettingStatus | null> {
        return this.events;
    }

    /**
     * @description Refresh and fetch betting status data based on the provided parameter. Will not call the API if user is not authenticated.
     *
     * @param cached if false, it will invalidate the cache and fetch fresh value.
     */
    refresh(cached: boolean) {
        this.loaded = false;

        if (!this.user.isAuthenticated) {
            return;
        }

        this.load(cached);
    }

    private load(cached: boolean = true) {
        if (!this.loaded) {
            this.loaded = true;

            this.apiService.get('bettingstatus', { cached }).subscribe((data: BettingStatus) => {
                this.events.next(data);
            });
        }
    }
}
