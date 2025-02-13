import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @stable
 */
export interface PlayerLimit {
    limitType: string;
    currentLimit: number;
}

/**
 * @stable
 */
export interface PlayerLimitResponse {
    limits: PlayerLimit[];
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class PlayerLimitsService {
    private loaded: boolean;
    private playerLimitsEvents = new BehaviorSubject<PlayerLimit[] | null>(null);

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    getLimits(): Observable<PlayerLimit[] | null> {
        return this.playerLimitsEvents;
    }

    refresh() {
        this.loaded = false;

        if (!this.user.isAuthenticated) {
            return;
        }

        this.load();
    }

    get(): Observable<PlayerLimitResponse> {
        return this.apiService.get('playerlimits');
    }

    private load() {
        if (this.user.isAuthenticated && !this.loaded) {
            this.loaded = true;

            this.get().subscribe({
                next: (response: PlayerLimitResponse) => this.playerLimitsEvents.next(response.limits),
                error: () => this.playerLimitsEvents.next(null),
            });
        }
    }
}
