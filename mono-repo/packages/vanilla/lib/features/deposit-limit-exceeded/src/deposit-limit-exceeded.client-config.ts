import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnDepositLimitExceeded', product: ClientConfigProductName.SF })
@Injectable()
export class DepositLimitExceededConfig extends LazyClientConfigBase {
    template: ViewTemplate;
}

export function depositLimitExceededConfigFactory(service: LazyClientConfigService) {
    return service.get(DepositLimitExceededConfig);
}
