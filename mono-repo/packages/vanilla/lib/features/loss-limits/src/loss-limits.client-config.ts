import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplate,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnLossLimits', product: ClientConfigProductName.SF })
@Injectable()
export class LossLimitsConfig extends LazyClientConfigBase {
    closeWaitingTime: number;
    content: ViewTemplate;
    updateCTA: MenuContentItem;
}

export function lossLimitsConfigFactory(service: LazyClientConfigService) {
    return service.get(LossLimitsConfig);
}
