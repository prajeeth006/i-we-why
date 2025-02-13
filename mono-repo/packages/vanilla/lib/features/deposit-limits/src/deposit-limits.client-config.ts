import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnDepositLimits', product: ClientConfigProductName.SF })
@Injectable()
export class DepositLimitsConfig extends LazyClientConfigBase {
    lowThresholds: { [limit: string]: { [currency: string]: number } };
}

export function depositLimitsFactory(service: LazyClientConfigService) {
    return service.get(DepositLimitsConfig);
}
