import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';
import { OffersResourceService } from '@frontend/vanilla/shared/offers';

const NOT_AUTHENTICATED_STATUS = 'NOT_AUTHENTICATED';
const OFFERED_STATUS = 'OFFERED';
const OFFER_DSL_INVALIDATE_KEY = 'Offer';

@Injectable()
export class OfferDslValuesProvider implements DslValuesProvider {
    private status: Map<string, string> = new Map();

    constructor(
        private user: UserService,
        private dslRecorderService: DslRecorderService,
        private offersResourceService: OffersResourceService,
        private dslCacheService: DslCacheService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Offer: this.dslRecorderService
                .createRecordable('offer')
                .createFunction({
                    name: 'GetStatus',
                    get: (offerType: string, offerId: string) => this.getStatus(offerType, offerId),
                    deps: [OFFER_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'IsOffered',
                    get: (offerType: string, offerId: string) => this.isOffered(offerType, offerId),
                    deps: [OFFER_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                }),
        };
    }

    private getStatus(offerType: string, offerId: string) {
        if (!this.user.isAuthenticated) {
            return NOT_AUTHENTICATED_STATUS;
        }

        const key = `${offerType}-${offerId}`;
        if (this.status.has(key)) {
            return this.status.get(key);
        } else {
            this.offersResourceService.getStatus(offerType, offerId).subscribe((result) => {
                this.status.set(key, result?.status);
                this.dslCacheService.invalidate([OFFER_DSL_INVALIDATE_KEY]);
            });
            return DSL_NOT_READY;
        }
    }

    private isOffered(offerType: string, offerId: string) {
        if (!this.user.isAuthenticated) {
            return false;
        }

        const status = this.getStatus(offerType, offerId);
        return status === DSL_NOT_READY ? status : status === OFFERED_STATUS;
    }
}
