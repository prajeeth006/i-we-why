import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BalanceProperties } from '../../user/user.models';
import { LazyServiceProviderBase } from './lazy-service-provider-base';

@Injectable({
    providedIn: 'root',
})
export class BalancePropertiesCoreService extends LazyServiceProviderBase {
    get balanceProperties(): Observable<BalanceProperties | null> {
        return this.inner.balanceProperties;
    }

    get balanceInfo(): BalanceProperties | null {
        return this.inner.balanceInfo();
    }
}
