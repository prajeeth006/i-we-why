import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { TimerService } from '../browser/timer.service';
import { Page } from '../client-config/page.client-config';
import { ClientConfigProductName } from '../core';
import { DslService } from '../dsl/dsl.service';
import { HostApiService } from '../http/host-api.service';
import { ProductService } from '../products/product.service';

/**
 * @stable
 */
export interface GetJsonOptions {
    filterOnClient?: boolean;
    product?: ClientConfigProductName;
}

/**
 * @whatItDoes Queries server for Sitecore content.
 *
 * @howToUse
 *
 * ```
 * contentService.getJson('App-v1.0/Some/Content').subscribe((content) => {
 *     this.content = content;
 * })
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ContentService {
    private expiry = 5 * 60 * 1000; // 5min
    private cachedResponses = new Map<string, Observable<any>>();

    constructor(
        private apiService: HostApiService,
        private timerService: TimerService,
        private dslService: DslService,
        private productService: ProductService,
        private page: Page,
    ) {}

    getJson(path: string, options?: GetJsonOptions): Observable<any> {
        options = options || {};
        if (!this.cachedResponses.has(path)) {
            const productMetadata = options.product ? this.productService.getMetadata(options.product) : null;
            const productEnabled = productMetadata?.isEnabled === true;
            const apiBaseUrl = productEnabled ? productMetadata.apiBaseUrl : this.productService.current.apiBaseUrl;
            const request = this.apiService
                .get(
                    'content',
                    { path: path, filterOnClient: options.filterOnClient },
                    {
                        baseUrl: apiBaseUrl,
                        headers: productEnabled ? { [`x-bwin-${options.product}-api`]: this.page.environment } : {},
                    },
                )
                .pipe(publishReplay(1), refCount());

            this.cachedResponses.set(path, request);

            this.timerService.setTimeoutOutsideAngularZone(() => this.evictFromCache(path), this.expiry);
        }

        return this.cachedResponses.get(path)!;
    }

    getJsonFiltered<T>(path: string, product?: ClientConfigProductName): Observable<T> {
        return this.getJson(path, product ? { filterOnClient: true, product: product } : { filterOnClient: true }).pipe(
            switchMap((c) => this.dslService.evaluateContent<T>(c)),
        );
    }

    private evictFromCache(path: string) {
        this.cachedResponses.delete(path);
    }
}
