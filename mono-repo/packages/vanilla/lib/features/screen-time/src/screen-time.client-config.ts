import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnScreenTime', product: ClientConfigProductName.SF })
@Injectable()
export class ScreenTimeConfig extends LazyClientConfigBase {
    minimumScreenTime: number;
    minimumUpdateInterval: number;
    idleTimeout: number;
}

export function screenTimeConfigFactory(service: LazyClientConfigService) {
    return service.get(ScreenTimeConfig);
}
