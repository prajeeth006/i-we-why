import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnOffers', product: ClientConfigProductName.SF })
@Injectable()
export class OffersConfig extends LazyClientConfigBase {
    updateInterval: number;
}

export function offersConfigFactory(service: LazyClientConfigService) {
    return service.get(OffersConfig);
}
