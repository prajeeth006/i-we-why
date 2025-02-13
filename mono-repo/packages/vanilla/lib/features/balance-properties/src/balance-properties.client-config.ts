import { Injectable } from '@angular/core';

import { BalanceProperties, ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnBalanceProperties', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: balancePropertiesConfigFactory,
})
export class BalancePropertiesConfig extends LazyClientConfigBase {
    balanceProperties: BalanceProperties;
}

export function balancePropertiesConfigFactory(service: LazyClientConfigService) {
    return service.get(BalancePropertiesConfig);
}
