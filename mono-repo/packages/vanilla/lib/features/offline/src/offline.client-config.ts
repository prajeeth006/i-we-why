import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnOffline', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: offlineConfigFactory,
    deps: [LazyClientConfigService],
})
export class OfflineConfig extends LazyClientConfigBase {
    isOverlayEnabled: string;
    offlineRequestsThreshold: number;
    content: ViewTemplate;
}

export function offlineConfigFactory(service: LazyClientConfigService) {
    return service.get(OfflineConfig);
}
