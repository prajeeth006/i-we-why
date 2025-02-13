import { InjectFlags, Injectable, InjectionToken, Injector, Type } from '@angular/core';

import { ProductService } from './product.service';

/**
 * @whatItDoes Combines root injector and lazy loaded product injector.
 *
 * @description
 *
 * This can be used to simplify getting of (multi) providers from both root and product injectors.
 * This should only be necessary in shared components (vanilla/labelhost).
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ProductInjector {
    constructor(
        private injector: Injector,
        private productService: ProductService,
    ) {}

    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
        let value: T | undefined;

        if (!this.productService.current.isHost) {
            value = this.productService.current.injector.get(token, undefined, InjectFlags.Optional);
        }

        return value || this.injector.get(token, notFoundValue, flags);
    }

    getMultiple<T>(token: Type<T[]> | InjectionToken<T[]>): T[] {
        const value = this.injector.get<T[]>(token, [], InjectFlags.Optional);

        if (this.productService.current.isHost) {
            return value;
        }

        const productValues = this.productService.current.injector.get<T[]>(token, [], InjectFlags.Optional);

        return value.concat(productValues);
    }
}
