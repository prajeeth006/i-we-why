import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @stable
 */
export interface SofStatusDetails {
    sofStatus: string;
    redStatusDays: number;
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class SofStatusDetailsCoreService extends LazyServiceProviderBase {
    get statusDetails(): Observable<SofStatusDetails | null> {
        return this.inner.statusDetails;
    }

    refresh(cached: boolean = true) {
        this.inner.refresh(cached);
    }
}
