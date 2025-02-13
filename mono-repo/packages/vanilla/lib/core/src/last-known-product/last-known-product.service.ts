import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { LastKnownProductConfig } from './last-known-product.client-config';

/**
 * @stable
 */
export interface LastKnownProduct {
    /** Homepage url of product */
    url: string;
    /** Product name */
    name: string | 'unknown';
    /** Indicates previous product name */
    previous: string | 'unknown';
    /** Platform product id */
    platformProductId: string;
}

/**
 * @whatItDoes Provides access to last known product
 *
 * @description Stores and retrieves last known product from cookie named `lastKnownProduct`
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LastKnownProductService {
    /** @internal */
    get update(): Observable<LastKnownProduct> {
        return this.updateEvents;
    }

    private updateEvents = new Subject<LastKnownProduct>();

    constructor(
        private cookie: CookieService,
        private config: LastKnownProductConfig,
    ) {}

    /** @internal */
    add(lastKnownProduct: LastKnownProduct) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);

        this.cookie.putObject(CookieName.LastKnownProduct, lastKnownProduct, { expires: expireDate });
        this.updateEvents.next(lastKnownProduct);
    }

    /** Gets last known product. Returns the value of proxy item MobileLogin-v1.0/Links/BackToProduct. */
    get(): LastKnownProduct {
        const lkp = this.cookie.getObject(CookieName.LastKnownProduct) as LastKnownProduct;

        return lkp || { name: 'unknown', url: this.config.url, previous: 'unknown', platformProductId: '' };
    }
}
