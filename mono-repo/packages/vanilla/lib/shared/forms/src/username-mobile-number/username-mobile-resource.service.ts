import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class UsernameMobileNumberResourceService {
    get countries() {
        return this.countriesList;
    }
    private countriesList: Observable<any>;

    constructor(private api: SharedFeaturesApiService) {
        this.countriesList = this.getCountries().pipe(shareReplay());
    }

    private getCountries() {
        return this.api.get('mobilenumber/countries').pipe(map((result) => result.countries));
    }
}
