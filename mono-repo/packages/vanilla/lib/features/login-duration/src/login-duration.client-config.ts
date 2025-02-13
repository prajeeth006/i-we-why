import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, TimeFormat } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnLoginDuration', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: loginDurationConfigFactory,
    deps: [LazyClientConfigService],
})
export class LoginDurationConfig extends LazyClientConfigBase {
    text: string;
    slotName: string;
    timeFormat: TimeFormat;
}

export function loginDurationConfigFactory(service: LazyClientConfigService) {
    return service.get(LoginDurationConfig);
}
