import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { KeyValue, OfferResponse } from './offers.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class OffersResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    getCount(): Observable<KeyValue[]> {
        return this.api.get('offers/count');
    }

    getStatus(offerType: string, offerId: string): Observable<OfferResponse> {
        return this.api.get(`offers/${offerType}/${offerId}`);
    }

    updateStatus(offerType: string, offerId: string, optIn: boolean = true): Observable<OfferResponse> {
        return this.api.post(`offers/${offerType}/${offerId}/${optIn}`);
    }
}
