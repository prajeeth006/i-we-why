import { Injectable, inject } from '@angular/core';

import { Coordinates, Position, WINDOW } from '@frontend/vanilla/core';
import { Observable, Subject } from 'rxjs';

import { GeolocationConfig } from './geolocation.client-config';

/** The reason of an error occurring when using the geolocating device.
 * @experimental
 */
export interface PositionError {
    readonly code: number;
    readonly message: string;
    readonly PERMISSION_DENIED: number;
    readonly POSITION_UNAVAILABLE: number;
    readonly TIMEOUT: number;
}

/** Encapsulates browser API to observable and clones native objects to JSON friendly ones. */
@Injectable()
export class GeolocationBrowserApiService {
    private changesSubject: Subject<Position>;
    readonly #window = inject(WINDOW);

    constructor(private config: GeolocationConfig) {}

    get positionChanges(): Observable<Position> {
        if (!this.changesSubject) {
            this.changesSubject = new Subject();
            const watchId = this.geolocationApi.watchPosition(
                (p) => this.onPositionChanged(p),
                (e) => this.onPositionFailed(e, watchId),
                this.config.watchOptions,
            );
        }
        return this.changesSubject;
    }

    private onPositionChanged(position: Position) {
        this.changesSubject.next({
            timestamp: position.timestamp,
            coords: cloneNativeCoordinatesToJsonObj(position.coords),
        });
    }

    private onPositionFailed(error: PositionError, watchId: number) {
        if (error.code === error.PERMISSION_DENIED) {
            this.geolocationApi.clearWatch(watchId);
        }

        this.changesSubject.error(cloneNativeErrorToJsonObj(error));
    }

    private get geolocationApi() {
        return this.#window.navigator.geolocation;
    }
}

export function cloneNativeCoordinatesToJsonObj(coords: Coordinates): Coordinates {
    return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
    };
}

function cloneNativeErrorToJsonObj(error: PositionError): PositionError {
    return {
        code: error.code,
        message: error.message,
        PERMISSION_DENIED: error.PERMISSION_DENIED,
        POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
        TIMEOUT: error.TIMEOUT,
    };
}
