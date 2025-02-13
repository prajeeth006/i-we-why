import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnInbox', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: inboxConfigFactory,
})
export class InboxConfig extends LazyClientConfigBase {
    counterPullInterval: number;
    enabled: boolean;
    jumioKycUrl: string;
    lazyLoading: LazyLoading;
    readTime: number;
    showOfferMessage: boolean;
    triggerJumioFromPlayerInbox: boolean;
    useRtms: boolean;
}

export function inboxConfigFactory(service: LazyClientConfigService) {
    return service.get(InboxConfig);
}

export class LazyLoading {
    pageSize: number;
    loadBeforeItems: number;
}
