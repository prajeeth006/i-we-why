import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { skipUntil } from 'rxjs/operators';

import { LazyServiceProviderBase } from '../service-providers/lazy-service-provider-base';
import { GeolocationPosition } from './geolocationposition';

/**
 * @whatItDoes Provides current geolocation position.
 * Gets null if position is not available yet or it's disabled by user in browser or the feature is disabled.
 *
 * @howToUse
 * ```
 * const locationId = geolocationService.currentPosition?.mappedLocation?.locationId;
 *
 * geolocationService.positionChanges.subscribe(position => {
 *    // ...
 * });
 * ```
 *
 * @experimental
 */
@Injectable({ providedIn: 'root' })
export class GeolocationService extends LazyServiceProviderBase {
    get currentPosition(): GeolocationPosition | null {
        return this.inner.currentPosition;
    }

    get positionChanges(): Observable<GeolocationPosition> {
        return this.inner.positionChanges.pipe(skipUntil(this.whenReady));
    }

    watchBrowserPositionChanges(): void {
        this.inner.watchBrowserPositionChanges();
    }
}
