import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnCurrentSession', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: currentSessionConfigFactory,
    deps: [LazyClientConfigService],
})
export class CurrentSessionConfig extends LazyClientConfigBase {
    loginDuration: number | null;
    remainingLoginTime: number | null;
}

export function currentSessionConfigFactory(service: LazyClientConfigService) {
    return service.get(CurrentSessionConfig);
}
