import { Injectable } from '@angular/core';

import { GeolocationPosition, MappedGeolocation } from '@frontend/vanilla/core';

import { GeolocationService } from './geolocation.service';

@Injectable()
export class GeolocationDslResolver {
    private currentPosition: GeolocationPosition | null;
    constructor(private geolocationService: GeolocationService) {
        this.geolocationService.positionChanges.subscribe((position: GeolocationPosition) => (this.currentPosition = position));
    }

    getPosition(getValue: (p: GeolocationPosition) => number | null): number {
        const position = this.currentPosition;
        if (!position) {
            throw new Error(
                `Currently there is no position resolved by browser so its properties cannot't be accessed.` +
                    ` Returning zero would be misleading as far as it's a valid value. Check HasPosition first.`,
            );
        }
        return getValue(position) || 0;
    }

    getLocation(getValue: (l: MappedGeolocation) => string | null) {
        const location = this.currentPosition?.mappedLocation;
        return location ? getValue(location) || '' : ''; // Sanitize null b/c client DSL engine doesn't do it
    }

    hasPosition(): boolean {
        return !!this.currentPosition;
    }
}
