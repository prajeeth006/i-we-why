import { Injectable } from '@angular/core';

import { Observable, first, shareReplay } from 'rxjs';

import { SharedFeaturesApiService } from '../http/shared-features-api.service';
import { DslCacheService } from './dsl-cache.service';
import { DSL_NOT_READY } from './dsl-recorder.service';

export class DslValueCacheKey {
    public static readonly BONUS_AWARD: string = 'bonus_award_dsl';
    public static readonly LICENSE_INFO: string = 'license_Info_dsl';
    public static readonly SHOP: string = 'shop_dsl';
    public static readonly TERMINAL: string = 'terminal_dsl';
    public static readonly GEO_IP: string = 'geo_ip_dsl';
}

interface TRequest {
    cacheKey: string;
    endpoint: string;
    invalidateKey: string;
    requestData?: any;
    get: (data: any) => any;
}

/**
 * @whatItDoes Calls API endpoint and cache the result.
 *
 * @howToUse
 *
 * ```
 * const result = this.dslValueAsyncResolver.resolve({
 *          cacheKey: DslValueCacheKey.SHOP,
            endpoint: 'shop',
            invalidateKey: SHOP_DSL_INVALIDATE_KEY,
            get: (data) => data?.shopDetails});
 * ```
 *
 * @description
 *
 * Service that can be used for calling API endpoint and then caching the result and invalidating dsl cache.
 *
 * @stable
 */

@Injectable({
    providedIn: 'root',
})
export class DslValueAsyncResolver {
    private cacheData: Map<string, any> = new Map();
    private cacheRequest: Map<string, Observable<any>> = new Map();

    constructor(
        private dslCacheService: DslCacheService,
        private apiService: SharedFeaturesApiService,
    ) {}

    /**
     * @param cacheKey used to set cache key
     * @param endpoint api endpoint to call
     * @param invalidateKey key that is used to invalidate dsl cache
     * @param get delegate used to extract value from response
     * @returns value evaluated by delegate
     */
    resolve(request: TRequest) {
        if (this.cacheData.has(request.cacheKey)) {
            return this.cacheData.get(request.cacheKey);
        } else {
            return this.execute(request);
        }
    }

    private execute(request: TRequest) {
        if (this.cacheRequest.has(request.cacheKey)) {
            this.cacheRequest
                .get(request.cacheKey)
                ?.pipe(first())
                .subscribe((result: any) => {
                    this.cacheData.set(request.cacheKey, request.get(result));
                    this.dslCacheService.invalidate([request.invalidateKey]);
                });
        } else {
            this.cacheRequest.set(
                request.cacheKey,
                this.apiService
                    .get(request.endpoint, request.requestData, {
                        showSpinner: false,
                    })
                    .pipe(shareReplay()),
            );
            this.resolve(request);
        }

        return DSL_NOT_READY;
    }
}
