import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { MlifeLoyalityProfile } from './loyality-profile.models';

@Injectable({
    providedIn: 'root',
})
export class LoyalityProfileService {
    private loaded: boolean;
    private mlifeLoyalityProfileEvents = new BehaviorSubject<MlifeLoyalityProfile | null>(null);

    get mlifeLoyalityProfile(): Observable<MlifeLoyalityProfile | null> {
        this.load();
        return this.mlifeLoyalityProfileEvents;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    refresh() {
        this.loaded = false;
        this.load();
    }

    private load() {
        if (!this.loaded) {
            this.loaded = true;
            this.apiService.get('accountmenu/mlifeprofile').subscribe((s: MlifeLoyalityProfile) => this.mlifeLoyalityProfileEvents.next(s));
        }
    }
}
