import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplate,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnUserSummary', product: ClientConfigProductName.SF })
@Injectable()
export class UserSummaryConfig extends LazyClientConfigBase {
    skipOverlay: boolean;
    template: ViewTemplate;
    summaryItems: MenuContentItem[];
}

export function userSummaryConfigFactory(service: LazyClientConfigService) {
    return service.get(UserSummaryConfig);
}
