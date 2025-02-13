import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnOfflinePage', product: ClientConfigProductName.SF })
@Injectable()
export class OfflinePageConfig extends LazyClientConfigBase {
    pollInterval: number;
}

export function offlinePageConfigFactory(service: LazyClientConfigService) {
    return service.get(OfflinePageConfig);
}
