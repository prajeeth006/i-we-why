import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplate,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnSmartBanner', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: smartBannerFactory,
    deps: [LazyClientConfigService],
})
export class SmartBannerConfig extends LazyClientConfigBase {
    isEnabledCondition: string;
    content: ViewTemplate;
    appInfo: MenuContentItem;
    appId: string;
    minimumRating: number;
    displayCounter: number;
    apiForDataSource: 'PosApi' | 'Sitecore';
}

export function smartBannerFactory(service: LazyClientConfigService) {
    return service.get(SmartBannerConfig);
}
