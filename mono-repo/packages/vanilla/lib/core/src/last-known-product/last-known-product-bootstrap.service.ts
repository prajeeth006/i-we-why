import { Injectable } from '@angular/core';

import { first } from 'rxjs/operators';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { AppInfoConfig } from '../client-config/app-info.client-config';
import { DslService } from '../dsl/dsl.service';
import { LastKnownProductConfig } from './last-known-product.client-config';
import { LastKnownProductService } from './last-known-product.service';

@Injectable()
export class LastKnownProductBootstrapService implements OnAppInit {
    constructor(
        private config: LastKnownProductConfig,
        private dslService: DslService,
        private lastKnownProductService: LastKnownProductService,
        private appInfoConfig: AppInfoConfig,
    ) {}

    onAppInit() {
        //TODO: this should probably be moved to product activation moment - now this relies on full page reload between products
        this.dslService
            .evaluateExpression<boolean>(this.config.enabled)
            .pipe(first())
            .subscribe((isEnabled) => {
                if (isEnabled) {
                    const lastKnownProduct = this.lastKnownProductService.get();
                    const lastKnownProductName = lastKnownProduct.name;
                    const lastKnownProductUrl = lastKnownProduct.url;
                    const isDifferentProduct = lastKnownProductName !== this.config.product;
                    if (isDifferentProduct || lastKnownProductUrl !== this.config.url) {
                        this.lastKnownProductService.add({
                            url: this.config.url,
                            name: this.config.product,
                            previous: isDifferentProduct ? lastKnownProductName : lastKnownProduct.previous, // if user stays on same product but different url use previous product
                            platformProductId: this.appInfoConfig.product,
                        });
                    }
                }
            });
    }
}
