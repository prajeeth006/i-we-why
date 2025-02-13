import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnAdobeTarget', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: adobeTargetConfigFactory,
})
export class AdobeTargetConfig extends LazyClientConfigBase {
    token: string;
}

export function adobeTargetConfigFactory(service: LazyClientConfigService) {
    return service.get(AdobeTargetConfig);
}
