import { Injectable, inject } from '@angular/core';

import { LaunchDarklyLazyContextProvider, Logger } from '@frontend/vanilla/core';
import { LDContext } from 'launchdarkly-js-client-sdk';
import { firstValueFrom, timeout } from 'rxjs';

import { GeolocationService } from './geolocation.service';

@Injectable()
export class GeolocationContextProvider extends LaunchDarklyLazyContextProvider {
    private readonly geolocationService = inject(GeolocationService);
    private readonly log = inject(Logger);

    async getLazyContext(): Promise<LDContext> {
        await firstValueFrom(this.geolocationService.positionChanges.pipe(timeout(10000))).catch(() => {
            this.log.warn('positionChanges failed of timed out in GeolocationContextProvider.');
            return {};
        });

        return {
            kind: 'multi',
            state: this.geolocationService.currentPosition?.mappedLocation?.stateClient
                ? { key: this.geolocationService.currentPosition?.mappedLocation.stateClient }
                : undefined,
            country: this.geolocationService.currentPosition?.mappedLocation?.countryClient
                ? { key: this.geolocationService.currentPosition?.mappedLocation.countryClient }
                : undefined,
        };
    }
}
