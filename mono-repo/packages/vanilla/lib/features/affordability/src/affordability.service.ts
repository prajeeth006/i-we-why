import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, TrackingService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject } from 'rxjs';

import { AffordabilitySnapshotDetails } from './affordability.models';

@Injectable({
    providedIn: 'root',
})
export class AffordabilityService {
    readonly snapshotDetails = new BehaviorSubject<AffordabilitySnapshotDetails | null>(null);

    private loaded: boolean;

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
        private trackingService: TrackingService,
    ) {}

    /**
     * @description Will not call the API if user is not authenticated.
     */
    load() {
        if (this.user.isAuthenticated && !this.loaded) {
            this.loaded = true;

            this.apiService.post('affordability/snapshotdetails').subscribe((snapshotDetails: AffordabilitySnapshotDetails) => {
                if (snapshotDetails?.affordabilityStatus)
                    this.trackingService.updateDataLayer({ 'user.affordabilityJourney': snapshotDetails.affordabilityStatus?.toLowerCase() });
                this.snapshotDetails.next(snapshotDetails);
            });
        }
    }
}
