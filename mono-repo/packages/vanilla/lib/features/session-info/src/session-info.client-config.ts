import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnSessionInfo', product: ClientConfigProductName.SF })
@Injectable()
export class SessionInfoConfig extends LazyClientConfigBase {
    urlBlacklist: string[];
    showWinningsLosses: boolean;
    showTotalWager: boolean;
    enableLogoutButton: boolean;
    content: MenuContentItem;
}

export function sessionInfoConfigFactory(service: LazyClientConfigService) {
    return service.get(SessionInfoConfig);
}
