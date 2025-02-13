import { Injectable } from '@angular/core';

import {
    DateTimeOffset,
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslTimeConverterService,
    DslValuesProvider,
    MappedGeolocation,
    Position,
    TimeSpan,
} from '@frontend/vanilla/core';

import { GeolocationDslResolver } from './geolocation-dsl-resolver';
import { GeolocationService } from './geolocation.service';

const DEPENDENCIES = ['geolocation'];

@Injectable()
export class GeolocationDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private dslTimeConverter: DslTimeConverterService,
        private geolocationService: GeolocationService,
        private geolocationDslResolver: GeolocationDslResolver,
    ) {
        this.geolocationService.positionChanges.subscribe(() => dslCacheService.invalidate(DEPENDENCIES));
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('geolocation');
        const resolver = this.geolocationDslResolver;

        createProperty('HasPosition', () => resolver.hasPosition());
        createPositionProperty('Timestamp', (p) => this.dslTimeConverter.fromTimeToDsl(new DateTimeOffset(p.timestamp, TimeSpan.ZERO)));
        createPositionProperty('Latitude', (p) => p.coords.latitude);
        createPositionProperty('Longitude', (p) => p.coords.longitude);
        createPositionProperty('Altitude', (p) => p.coords.altitude);
        createPositionProperty('Accuracy', (p) => p.coords.accuracy);
        createPositionProperty('AltitudeAccuracy', (p) => p.coords.altitudeAccuracy);
        createPositionProperty('Heading', (p) => p.coords.heading);
        createPositionProperty('Speed', (p) => p.coords.speed);

        createLocationProperty('LocationId', (l) => l.locationId);
        createLocationProperty('LocationName', (l) => l.locationName);
        createLocationProperty('City', (l) => l.city);
        createLocationProperty('State', (l) => l.state);
        createLocationProperty('Zip', (l) => l.zip);
        createLocationProperty('Country', (l) => l.country);

        createLocationProperty('LocationNameClient', (l) => l.locationNameClient);
        createLocationProperty('CityClient', (l) => l.cityClient);
        createLocationProperty('StateClient', (l) => l.stateClient);
        createLocationProperty('PostCodeClient', (l) => l.postCodeClient);
        createLocationProperty('CountryClient', (l) => l.countryClient);

        return { Geolocation: recordable };

        function createPositionProperty(name: string, get: (p: Position) => number | null) {
            createProperty(name, () => resolver.getPosition((p) => get(p)));
        }

        function createLocationProperty(name: string, get: (p: MappedGeolocation) => string | null) {
            createProperty(name, () => resolver.getLocation((p) => get(p)));
        }

        function createProperty(name: string, get: () => number | string | boolean | null) {
            recordable.createProperty({ name, get, deps: DEPENDENCIES });
        }
    }
}
