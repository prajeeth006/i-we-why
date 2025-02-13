import { Injectable, signal } from '@angular/core';

import { SharedFeaturesApiService, SofStatusDetails, UserService } from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class SofStatusDetailsService {
    static UnauthSofStatusDetails: SofStatusDetails = {
        sofStatus: '',
        redStatusDays: -1,
    };

    readonly sofStatusDetails = signal<SofStatusDetails | null>(null);

    get statusDetails(): Observable<SofStatusDetails | null> {
        return this.sofStatusDetailsEvents;
    }

    private sofStatusDetailsEvents = new ReplaySubject<SofStatusDetails>(1);
    private loaded: boolean;

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    refresh(cached: boolean = true) {
        this.loaded = false;

        this.load(cached);
    }

    private load(cached: boolean) {
        if (this.user.isAuthenticated && !this.loaded) {
            this.loaded = true;

            this.apiService.get('sofstatusdetails', { cached: cached }).subscribe((sofStatus: SofStatusDetails) => {
                this.sofStatusDetailsEvents.next(sofStatus);
                this.sofStatusDetails.set(sofStatus);
            });
        }
    }
}
