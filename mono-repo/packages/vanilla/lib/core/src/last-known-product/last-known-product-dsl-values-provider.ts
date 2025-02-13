import { Injectable } from '@angular/core';

import { DslCacheService } from '../dsl/dsl-cache.service';
import { DslRecorderService } from '../dsl/dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl/dsl.models';
import { LastKnownProductService } from './last-known-product.service';

@Injectable()
export class LastKnownProductDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private lastKnownProductService: LastKnownProductService,
    ) {
        this.lastKnownProductService.update.subscribe(() => dslCacheService.invalidate(['lastKnownProduct']));
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            LastKnownProduct: this.dslRecorderService
                .createRecordable('lastKnownProduct')
                .createProperty({ name: 'Name', get: () => this.lastKnownProductService.get().name, deps: ['lastKnownProduct'] })
                .createProperty({ name: 'Previous', get: () => this.lastKnownProductService.get().previous, deps: ['lastKnownProduct'] })
                .createProperty({
                    name: 'PlatformProductId',
                    get: () => this.lastKnownProductService.get().platformProductId || '',
                    deps: ['lastKnownProduct'],
                })
                .createProperty({ name: 'Url', get: () => this.lastKnownProductService.get().url, deps: ['lastKnownProduct'] }),
        };
    }
}
