import { Injectable } from '@angular/core';

import {
    CookieName,
    CookieService,
    GeolocationService as CoreGeolocationService,
    NativeAppService,
    OnFeatureInit,
    TrackingService,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { filter, first, firstValueFrom, map, of, switchMap } from 'rxjs';

import { GeolocationConfig } from './geolocation.client-config';
import { GeolocationService } from './geolocation.service';

@Injectable()
export class GeolocationBootstrapService implements OnFeatureInit {
    constructor(
        private config: GeolocationConfig,
        private geolocationService: GeolocationService,
        private coreGeolocationService: CoreGeolocationService,
        private user: UserService,
        private trackingService: TrackingService,
        private nativeAppService: NativeAppService,
        private cookieService: CookieService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.geolocationService.clearPositionForGood();

        if (this.config.watchBrowserPositionOnAppStart) {
            this.geolocationService.watchBrowserPositionChanges();
        }

        this.geolocationService.restoreLastPositionFromCookie();
        this.geolocationService.watchNativePositionChanges();

        this.coreGeolocationService.set(this.geolocationService);

        this.trackGeolocationEventAfterLogin();
    }

    //Send Geolocation event to datalayer after login and location received, only once, for CIP to trigger geo targetted offers.
    private trackGeolocationEventAfterLogin() {
        this.geolocationService.positionChanges
            .pipe(
                first(),
                switchMap((geolocation) => {
                    if (this.user.isAuthenticated) {
                        return of(geolocation);
                    } else {
                        this.cookieService.remove(CookieName.VnGeolocationTracking);
                        return this.user.events.pipe(
                            filter((e) => e instanceof UserLoginEvent),
                            first(),
                            map(() => geolocation),
                        );
                    }
                }),
            )
            .subscribe((geolocation) => {
                const cookie = this.cookieService.get(CookieName.VnGeolocationTracking);
                if (!cookie && this.user.workflowType == 0) {
                    this.sendToGA(geolocation);
                }
            });
    }

    private sendToGA(geolocation: GeolocationPosition) {
        this.trackingService.triggerEvent('geolocation', {
            'user.profile.accountID': this.user.accountId,
            'native.nativeMode': this.nativeAppService.nativeMode,
            'GEO_LATITUDE': geolocation.coords.latitude,
            'GEO_LONGITUDE': geolocation.coords.longitude,
            'GEO_ALTITUDE': geolocation.coords.altitude,
            'GEO_ACCURACY': geolocation.coords.accuracy,
            'GEO_ALT_ACCURACY': geolocation.coords.altitudeAccuracy,
            'GEO_HEADING': geolocation.coords.heading,
            'GEO_SPEED': geolocation.coords.speed,
        });

        this.cookieService.put(CookieName.VnGeolocationTracking, '1');
    }
}
