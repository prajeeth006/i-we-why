import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnSpeculativeLink', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: speculativeLinkConfigFactory,
})
export class SpeculativeLinkConfig extends LazyClientConfigBase {
    isEnabled: boolean;
}

export function speculativeLinkConfigFactory(service: LazyClientConfigService): SpeculativeLinkConfig {
    return service.get(SpeculativeLinkConfig);
}
