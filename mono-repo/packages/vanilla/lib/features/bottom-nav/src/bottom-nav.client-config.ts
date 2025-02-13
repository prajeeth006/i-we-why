import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnBottomNav', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: bottomNavConfigFactory,
    deps: [LazyClientConfigService],
})
export class BottomNavConfig extends LazyClientConfigBase {
    isEnabledCondition: string;
    items: MenuContentItem[];
}

export function bottomNavConfigFactory(service: LazyClientConfigService) {
    return service.get(BottomNavConfig);
}
