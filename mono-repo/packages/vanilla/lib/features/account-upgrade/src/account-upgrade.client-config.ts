import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnAccountUpgrade', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: accountUpgradeFactory,
})
export class AccountUpgradeConfig extends LazyClientConfigBase {
    allowedUrls: string[];
    redirectUrl: string;
}

export function accountUpgradeFactory(service: LazyClientConfigService) {
    return service.get(AccountUpgradeConfig);
}
