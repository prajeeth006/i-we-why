import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';
import { LDOptions } from 'launchdarkly-js-client-sdk';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnLaunchDarkly', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: launchDarklyConfigFactory,
    deps: [LazyClientConfigService],
})
export class LaunchDarklyConfig extends LazyClientConfigBase {
    clientId: string;
    options: LDOptions;
    sessionCookieName: string;
}

export function launchDarklyConfigFactory(service: LazyClientConfigService) {
    return service.get(LaunchDarklyConfig);
}
