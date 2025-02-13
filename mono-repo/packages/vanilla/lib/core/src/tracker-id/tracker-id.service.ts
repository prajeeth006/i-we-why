import { Injectable } from '@angular/core';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { NavigationService } from '../navigation/navigation.service';
import { TrackerIdConfig } from './tracker-id.client-config';

@Injectable({
    providedIn: 'root',
})
export class TrackerIdService {
    constructor(
        private readonly trackerIdConfig: TrackerIdConfig,
        private readonly cookieService: CookieService,
        private readonly navigationService: NavigationService,
    ) {}

    get(): string {
        const queryString = this.navigationService.location.search;

        for (const name of this.trackerIdConfig.queryStrings) {
            const value = (queryString.get(name) || '').trim(); // external value -> not trusted -> trim

            if (value) {
                return value;
            }
        }

        return this.cookieService.get(CookieName.TrackerId) || '';
    }
}
