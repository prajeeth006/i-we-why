import { Injectable } from '@angular/core';

import {
    CookieName,
    Coordinates,
    GeolocationPosition,
    Logger,
    MappedGeolocation,
    NativeAppService,
    NativeEventType,
    Position,
    TimerService,
} from '@frontend/vanilla/core';
import { isEqual } from 'lodash-es';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { GeolocationBrowserApiService, cloneNativeCoordinatesToJsonObj } from './geolocation-browser-api.service';
import { GeolocationCookieService } from './geolocation-cookie.service';
import { GeolocationResourceService } from './geolocation-resource.service';
import { GeolocationConfig } from './geolocation.client-config';

export const LOG_PREFIX = 'VanillaGeolocation';

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
export class GeolocationService {
    /** Gets current position */
    get currentPosition(): GeolocationPosition | null {
        return this.lastPosition;
    }

    /** Gets current position and all future changes. */
    get positionChanges(): Observable<GeolocationPosition> {
        return this.positionSubject;
    }

    private lastPosition: GeolocationPosition | null = null;
    private positionSubject = new ReplaySubject<GeolocationPosition>(1);
    private timeoutId: NodeJS.Timeout;
    private isWatchBrowserPositionChangesStarted: boolean = false;

    constructor(
        private config: GeolocationConfig,
        private browserApi: GeolocationBrowserApiService,
        private cookie: GeolocationCookieService,
        private resource: GeolocationResourceService,
        private log: Logger,
        private timer: TimerService,
        private nativeApp: NativeAppService,
    ) {}

    watchBrowserPositionChanges() {
        if (this.config.useBrowserGeolocation && !this.isWatchBrowserPositionChangesStarted) {
            this.isWatchBrowserPositionChangesStarted = true;
            this.watchPositionChanges();
        }
    }

    /** @internal */
    watchNativePositionChanges() {
        if (this.nativeApp.isNative) {
            this.nativeApp.eventsFromNative
                .pipe(filter((e) => e.eventName?.toUpperCase() === NativeEventType.GEO_LOCATION_POSITION))
                .subscribe((e) => {
                    const parameters = e.parameters || {};
                    const newPosition: Position = {
                        timestamp: Math.floor(parameters['time'] * 1000), // app is sending timestamp in seconds
                        coords: cloneNativeCoordinatesToJsonObj(parameters as Coordinates),
                    };

                    if (this.isLastPositionEqualToNewPosition(newPosition)) return;

                    this.mapGeolocation(newPosition);
                });

            this.nativeApp.sendToNative({ eventName: NativeEventType.GET_GEO_LOCATION_POSITION });
        }
    }

    /** @internal */
    restoreLastPositionFromCookie() {
        this.lastPosition = this.cookie.read();

        if (this.lastPosition) {
            this.positionSubject.next(this.lastPosition);
            this.log.debug(`${LOG_PREFIX} restored this position from the cookie:`, this.lastPosition);
        }
    }

    /** @internal */
    clearPositionForGood() {
        this.lastPosition = null;
        this.cookie.delete();
    }

    private watchPositionChanges() {
        this.browserApi.positionChanges.subscribe({
            next: (p) => this.onPositionChanged(p),
            error: (e) => this.onPositionError(e),
        });
    }

    private onPositionChanged(newPosition: Position) {
        if (this.isLastPositionEqualToNewPosition(newPosition)) return;

        const mappingDueTime = Math.max(
            0,
            this.config.minimumUpdateIntervalMilliseconds - (newPosition.timestamp - (this.lastPosition?.timestamp ?? 0)),
        );
        this.log.debug(
            `${LOG_PREFIX} received new coordinates at time ${newPosition.timestamp}. Mapping them to a location on backend in ${mappingDueTime} milliseconds. New coordinates:`,
            newPosition.coords,
        );

        this.timer.clearTimeout(this.timeoutId);
        this.timeoutId = this.timer.setTimeout(() => this.mapGeolocation(newPosition), mappingDueTime);
    }

    private mapGeolocation(newPosition: Position) {
        this.log.infoRemote(`${LOG_PREFIX} mapping new coordinates.`);

        this.resource.mapGeolocation(newPosition.coords).subscribe({
            next: (location: MappedGeolocation | null) => {
                this.log.debug(
                    `${LOG_PREFIX} mapped new coordinates to following location. Writing it all to '${CookieName.GeoLocation}' cookie.`,
                    location,
                );
                this.log.infoRemote(
                    `${LOG_PREFIX} mapped new coordinates to '${CookieName.GeoLocation}' cookie. StateClient:${location?.stateClient}, CountryClient:${location?.countryClient}, Country:${location?.country}`,
                );
                this.setLastPosition(newPosition, location);
            },
            error: (error: any) => {
                this.log.errorRemote(
                    `${LOG_PREFIX} failed mapping new coordinates. Using them with null mapped location. Writing it all to '${CookieName.GeoLocation}' cookie. Error:`,
                    error,
                );
                this.setLastPosition(newPosition, null);
            },
        });
    }

    private onPositionError(error: any) {
        if (error.code === error.PERMISSION_DENIED) {
            this.log.debug(`${LOG_PREFIX} is disabled by user in the browser.`);
            this.clearPositionForGood();
        } else {
            this.log.warn(`${LOG_PREFIX} failed to watch the position. Using the last one and watch continues. Error:`, error);
        }

        this.positionSubject.error(error);
    }

    private isLastPositionEqualToNewPosition(newPosition: Position): boolean {
        if (this.lastPosition && isEqual(newPosition.coords, this.lastPosition.coords)) {
            this.log.debug(
                `${LOG_PREFIX} received same coordinates as the last position has. Only updating timestamp to ${newPosition.timestamp}. Writing it all to '${CookieName.GeoLocation}' cookie. Last position:`,
                this.lastPosition,
            );
            this.setLastPosition(newPosition, this.lastPosition.mappedLocation, { publishEvent: false });

            return true;
        }

        return false;
    }

    private setLastPosition(apiPosition: Position, mappedLocation: MappedGeolocation | null, opts?: { publishEvent: boolean }) {
        this.lastPosition = {
            coords: apiPosition.coords,
            timestamp: apiPosition.timestamp,
            mappedLocation,
        };

        this.cookie.write(this.lastPosition);

        if (!opts || opts.publishEvent) {
            this.log.infoRemote(`${LOG_PREFIX} sending position changed event.`);
            this.positionSubject.next(this.lastPosition);
        }
    }
}
