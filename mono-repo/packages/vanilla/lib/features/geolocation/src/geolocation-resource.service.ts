import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Coordinates, Logger, MappedGeolocation, SharedFeaturesApiService, UrlService } from '@frontend/vanilla/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';

import { GeolocationConfig } from './geolocation.client-config';

@Injectable()
export class GeolocationResourceService {
    constructor(
        private api: SharedFeaturesApiService,
        private config: GeolocationConfig,
        private urlService: UrlService,
        private httpClient: HttpClient,
        private logger: Logger,
    ) {}

    mapGeolocation(coords: Coordinates): Observable<MappedGeolocation | null> {
        const locationServerside = this.api.get('mappedgeolocation', coords);
        let locationClientSide = of({});

        if (this.config.clientApiUrl) {
            const url = this.urlService.parse(this.config.clientApiUrl);
            url.search.append('latitude', coords.latitude.toString());
            url.search.append('longitude', coords.longitude.toString());
            locationClientSide = this.httpClient.get(url.absUrl()).pipe(retry(2));
        }

        return forkJoin([locationServerside, locationClientSide]).pipe(
            map((result: any) => {
                const eventObj: any = {
                    locationId: null,
                    locationName: null,
                    city: null,
                    state: null,
                    zip: null,
                    country: null,

                    locationNameClient: null,
                    cityClient: null,
                    countryClient: null,
                    //comment to test pipeline.
                    postCodeClient: null,
                    stateClient: null,
                };

                // Location detail from server side
                if (result[0].location) {
                    eventObj.locationId = result[0].location['locationId'];
                    eventObj.locationName = result[0].location['locationName'];
                    eventObj.city = result[0].location['city'];
                    eventObj.state = result[0].location['state'];
                    eventObj.zip = result[0].location['zip'];
                    eventObj.country = result[0].location['country'];
                }

                // Location detail from Client side api
                if (result[1]) {
                    eventObj.locationNameClient = result[1]['locality'];
                    eventObj.cityClient = result[1]['city'];
                    eventObj.countryClient = result[1]['countryName'];
                    eventObj.postCodeClient = result[1]['postcode'];
                    eventObj.stateClient = result[1]['principalSubdivision'];
                }

                return eventObj;
            }),
            tap({
                error: (error) => {
                    this.logger.errorRemote('VanillaGeolocation failed mapping api response.', error);
                },
            }),
        );
    }
}
