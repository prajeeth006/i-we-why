import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnNavigationLayout', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: navigationLayoutConfigFactory,
})
export class NavigationLayoutConfig extends LazyClientConfigBase {
    version: number;
    navigation: MenuContentItem;
    elements: { [key: string]: MenuContentItem };
    leftMenuEnabledOnCustomerHub: string[];
}

export function navigationLayoutConfigFactory(service: LazyClientConfigService) {
    return service.get(NavigationLayoutConfig);
}
