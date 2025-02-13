import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { VN_PRODUCTS_KEY } from '../client-config/client-config.model';
import { ClientConfigService } from '../client-config/client-config.service';

export interface ProductInfo {
    enabled: boolean;
    enabledProductApi: boolean;
    apiBaseUrl: string;
}

@ClientConfig({ key: VN_PRODUCTS_KEY, product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: productConfigFactory,
})
export class ProductsConfig {
    [product: string]: ProductInfo;
}

export function productConfigFactory(service: ClientConfigService) {
    return service.get(ProductsConfig);
}
