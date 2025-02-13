import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @stable
 */
export interface MohDetails extends Record<string, any> {
    comments: string;
    countryCode: string;
    exclDays: number;
    mohPrimaryProductCode: number;
    mohPrimaryReasonCode: number;
    mohPrimaryRiskBandCode: number;
    mohPrimaryToolCode: number;
    mohScore: number;
    processed: string;
    vipUser: string;
}

/**
 * @stable
 */
@Injectable()
export class MohDetailsService {
    public static UnauthMohDetails: MohDetails = {
        comments: '',
        countryCode: '',
        exclDays: 0,
        mohPrimaryProductCode: 0,
        mohPrimaryReasonCode: 0,
        mohPrimaryRiskBandCode: 0,
        mohPrimaryToolCode: 0,
        mohScore: 0,
        processed: '',
        vipUser: '',
    };

    private loaded: boolean;
    private mohDetailsEvents = new BehaviorSubject<MohDetails | null>(null);

    get details(): Observable<MohDetails | null> {
        return this.mohDetailsEvents;
    }

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    public refresh(cached: boolean = true) {
        this.loaded = false;

        this.load(cached);
    }

    private load(cached: boolean): void {
        if (this.user.isAuthenticated && !this.loaded) {
            this.loaded = true;

            this.apiService.get('mohdetails', { cached: cached }).subscribe((s) => this.mohDetailsEvents.next(s));
        }
    }
}
