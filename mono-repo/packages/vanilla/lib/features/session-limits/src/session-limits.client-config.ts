import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnSessionLimits', product: ClientConfigProductName.SF })
@Injectable()
export class SessionLimitsConfig extends LazyClientConfigBase {
    skipOverlay: boolean;
    isAutoLogoutEnabled: boolean;
    closeWaitingTime: number;
    content: ViewTemplateForClient;
    updateCTA: MenuContentItem;
    version: number;
}

export function sessionLimitsConfigFactory(service: LazyClientConfigService) {
    return service.get(SessionLimitsConfig);
}
