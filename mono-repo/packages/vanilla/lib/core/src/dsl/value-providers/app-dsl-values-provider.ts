import { Injectable } from '@angular/core';

import { Page } from '../../client-config/page.client-config';
import { NativeAppService } from '../../native-app/native-app.service';
import { ProductService } from '../../products/product.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class AppDslValuesProvider implements DslValuesProvider {
    constructor(
        dslCacheService: DslCacheService,
        private dslRecorderService: DslRecorderService,
        private service: NativeAppService,
        private productService: ProductService,
        private page: Page,
    ) {
        this.productService.productChanged.subscribe(() => dslCacheService.invalidate(['productChanged']));
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            App: this.dslRecorderService
                .createRecordable('app')
                .createSimpleProperty(this.service, 'context', 'Context')
                .createProperty({ name: 'Theme', get: () => this.page.theme })
                .createProperty({
                    name: 'Product',
                    get: () => (this.productService.current.name === 'host' ? this.page.product : this.productService.current.name), // use only this.productService.current.name after single domain migration is finished
                    deps: 'productChanged',
                }),
        };
    }
}
