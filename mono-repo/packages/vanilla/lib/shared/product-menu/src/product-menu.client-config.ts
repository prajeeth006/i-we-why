import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnProductMenu', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: productMenuContentFactory,
})
export class ProductMenuConfig extends LazyClientConfigBase {
    tabs: MenuContentItem;
    apps: MenuContentItem;
    menu: MenuContentItem;
    header: MenuContentItem;
    numberOfApps: number;
    routerMode: boolean;
    v2: boolean;
    animateV1: boolean;
    hideTabsV1: boolean;
    showCloseButtonAsText: boolean;
    headerBarCssClass: string;
    closeButtonTextCssClass: string;
}

export function productMenuContentFactory(service: LazyClientConfigService) {
    return service.get(ProductMenuConfig);
}
