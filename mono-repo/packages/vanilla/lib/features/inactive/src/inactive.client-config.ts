import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnInactive', product: ClientConfigProductName.SF })
@Injectable()
export class InactiveConfig extends LazyClientConfigBase {
    toastTimeout: number;
    logoutTimeout: number;
    activityInterval: number;
}

export function configFactory(service: LazyClientConfigService): InactiveConfig {
    return service.get(InactiveConfig);
}
