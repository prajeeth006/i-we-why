import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface DepositLimit {
    currentLimit?: number;
    type: string;
    limitSet: boolean;
}

export interface DepositLimitsResonse {
    limits: DepositLimit[];
}

@Injectable({
    providedIn: 'root',
})
export class DepositLimitsService {
    private depositLimitsEvents = new ReplaySubject<DepositLimit[]>(1);
    private loaded: boolean = false;

    get limits(): Observable<DepositLimit[]> {
        return this.depositLimitsEvents;
    }

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    load() {
        if (this.user.isAuthenticated && !this.loaded) {
            this.loaded = true;
            this.get().subscribe((depositLimits: DepositLimitsResonse) => {
                this.depositLimitsEvents.next(depositLimits.limits);
            });
        }
    }

    get(): Observable<DepositLimitsResonse> {
        return this.apiService.get('depositlimits');
    }
}
