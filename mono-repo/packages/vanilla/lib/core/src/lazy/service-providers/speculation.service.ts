import { Injectable } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @whatItDoes Wraps around the Speculation Rules API.
 *
 * @howToUse
 *
 * ```
 * this.prerenderingService.whenReady.subscribe(() => this.prerenderingService.prerender(this.config.items.map((item) => item.url)));
 * ```
 *
 * This is an expensive and experimental service and should be used with caution.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class SpeculationService extends LazyServiceProviderBase {
    prerender(urls: string[]): void {
        this.inner.prerender(urls);
    }
}
