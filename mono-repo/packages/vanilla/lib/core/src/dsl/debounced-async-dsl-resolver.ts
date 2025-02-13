import { inject } from '@angular/core';

import { clone } from 'lodash-es';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { SharedFeaturesApiService } from '../http/shared-features-api.service';
import { DslCacheService } from './dsl-cache.service';
import { DSL_NOT_READY } from './dsl-recorder.service';
import { AsyncDslResponseBase } from './dsl.models';

/**
 * @description
 *
 * Helper base class for asynchronous DSL provider resolvers.
 *
 * @stable
 */
export abstract class DebouncedAsyncDslResolver<TRequest, TResponse extends TRequest & AsyncDslResponseBase> {
    private cache: Map<string, { result?: any }> = new Map();
    private buffer: TRequest[] = [];
    private updateEvents: Subject<void> = new Subject<void>();
    private dslCacheService = inject(DslCacheService);
    private apiService = inject(SharedFeaturesApiService);

    protected constructor() {
        this.updateEvents.pipe(debounceTime(0)).subscribe(() => this.execute());
    }

    protected abstract get refPrefix(): string;

    protected abstract get endpoint(): string;

    resolve(request: TRequest) {
        const cacheKey = this.createCacheKey(request);
        const cached = this.cache.get(cacheKey);

        if (cached) {
            if (cached.result != null) {
                return cached.result;
            }
        } else {
            this.cache.set(cacheKey, {});
            this.buffer.push(request);

            this.updateEvents.next();
        }

        return DSL_NOT_READY;
    }

    protected abstract createCacheKey(request: TRequest): string;

    private execute() {
        const request = clone(this.buffer);
        this.buffer.length = 0;

        this.apiService
            .post(this.endpoint, request, {
                showSpinner: false,
            })
            .pipe(map((resp: any) => resp.data))
            .subscribe((data: TResponse[]) => {
                const watchRefs: string[] = [];

                data.forEach((result) => {
                    const cacheKey = this.createCacheKey(result);
                    this.cache.get(cacheKey)!.result = result;

                    watchRefs.push(`${this.refPrefix}.${cacheKey}`);
                });

                this.dslCacheService.invalidate(watchRefs);
            });
    }
}
