import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnSelfExclusion', product: ClientConfigProductName.SF })
@Injectable()
export class SelfExclusionConfig extends LazyClientConfigBase {
    updateInterval: number;
}

export function selfExclusionFactory(service: LazyClientConfigService) {
    return service.get(SelfExclusionConfig);
}
