import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

export interface ConditionalEvent {
    eventName: string;
    urlRegex: string;
    timeoutMilliseconds: number;
}

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnLivePerson', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: livePersonConfigFactory,
})
export class LivePersonConfig extends LazyClientConfigBase {
    showInvite: boolean;
    accountId: string;
    conditionalEvents: ConditionalEvent[];
}

export function livePersonConfigFactory(service: LazyClientConfigService) {
    return service.get(LivePersonConfig);
}
