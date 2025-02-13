import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnOfferButton', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: offerButtonConfigFactory,
})
export class OfferButtonConfig extends LazyClientConfigBase {
    content?: ViewTemplate;
    buttonClass?: ViewTemplate;
    iconClass?: ViewTemplate;
    v2: boolean;
}

export function offerButtonConfigFactory(service: LazyClientConfigService) {
    return service.get(OfferButtonConfig);
}
