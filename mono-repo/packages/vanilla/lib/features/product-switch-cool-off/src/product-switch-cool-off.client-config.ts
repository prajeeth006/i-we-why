import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnProductSwitchCoolOff', product: ClientConfigProductName.SF })
@Injectable()
export class ProductSwitchCoolOffConfig extends LazyClientConfigBase {
    content: ViewTemplate;
}

export function productSwitchConfigFactory(service: LazyClientConfigService) {
    return service.get(ProductSwitchCoolOffConfig);
}
