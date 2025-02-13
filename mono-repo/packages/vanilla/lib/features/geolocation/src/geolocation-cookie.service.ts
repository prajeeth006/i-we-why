import { Injectable } from '@angular/core';

import { CookieName, CookieService, DateTimeService, GeolocationPosition } from '@frontend/vanilla/core';

import { GeolocationConfig } from './geolocation.client-config';

@Injectable()
export class GeolocationCookieService {
    constructor(
        private config: GeolocationConfig,
        private cookieService: CookieService,
        private dateTimeService: DateTimeService,
    ) {}

    read(): GeolocationPosition | null {
        const json = this.cookieService.get(CookieName.GeoLocation)?.trim();
        return json ? <GeolocationPosition>JSON.parse(json) : null;
    }

    write(position: GeolocationPosition) {
        const expires = this.calculateExpiration();
        this.cookieService.putObject(CookieName.GeoLocation, position, expires ? { expires } : undefined);
    }

    delete() {
        this.cookieService.remove(CookieName.GeoLocation);
    }

    private calculateExpiration(): Date | undefined {
        if (!this.config.cookieExpirationMilliseconds) {
            return;
        }

        const expiration = this.dateTimeService.now();
        expiration.setTime(expiration.getTime() + this.config.cookieExpirationMilliseconds);

        return expiration;
    }
}
