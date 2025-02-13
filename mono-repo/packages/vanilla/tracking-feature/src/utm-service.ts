import { Injectable } from '@angular/core';

import { UrlService, Utm } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class UtmService {
    public static storageKey: string = 'utm';

    constructor(private urlService: UrlService) {}

    parseFromUrl(url: string): Utm {
        const queryParameters = this.urlService.parse(url).search;

        const utm: Utm = {
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            utm_term: '',
            utm_content: '',
            utm_keyword: '',
        };

        queryParameters.keys().forEach((key) => {
            const value = queryParameters.get(key);
            if (key in utm && value !== null) {
                (utm as any)[key] = value;
            }
        });

        return utm;
    }
}
