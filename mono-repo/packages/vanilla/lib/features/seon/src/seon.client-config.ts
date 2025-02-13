import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';
import { SDKOptions } from '@seontechnologies/seon-javascript-sdk';

@LazyClientConfig({ key: 'vnSeon', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: seonConfigFactory,
})
export class SeonConfig extends LazyClientConfigBase {
    enabled: boolean;
    configParams: SDKOptions;
}

export function seonConfigFactory(service: LazyClientConfigService) {
    return service.get(SeonConfig);
}
