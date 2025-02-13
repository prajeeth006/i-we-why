import { Mock } from 'moxxi';

import { ProductsConfig } from '../../../core/src/products/products.client-config';

@Mock({ of: ProductsConfig })
export class ProductsConfigMock extends ProductsConfig {
    constructor() {
        super();

        this['host'] = {
            apiBaseUrl: 'host-url',
            enabled: true,
            enabledProductApi: false,
        };
    }
}
