import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnBalanceBreakdown', product: ClientConfigProductName.SF })
@Injectable()
export class BalanceBreakdownContent extends LazyClientConfigBase {
    myBalanceContent: MenuContentItem;
    isPaypalBalanceMessageEnabled: string;
    isPaypalReleaseFundsEnabled: string;
    v2: boolean;
}

export function balanceBreakdownConfigFactory(service: LazyClientConfigService) {
    return service.get(BalanceBreakdownContent);
}
