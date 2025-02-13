import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @whatItDoes Provides cashier resource methods.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class CashierResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    quickDepositEnabled(): Observable<boolean> {
        return this.api.get('cashier/quickdepositenabled').pipe(map((data) => data.enabled));
    }
}
