import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnHeader', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'any',
    useFactory: headerContentFactory,
    deps: [LazyClientConfigService],
})
export class HeaderConfig extends LazyClientConfigBase {
    isEnabledCondition: string;
    disabledItems: { disabled: string; sections: string[] };
    version: number;
    onboardingEnabled: boolean;
    hotspotLoginCount: number;
    pulseEffectLoginCount: number;
    elements: HeaderConfigElements;
    products: MenuContentItem[];
    enableToggleOnScroll: boolean;
}

export interface HeaderConfigElements {
    leftItems: MenuContentItem[];
    unauthItems: MenuContentItem[];
    authItems: MenuContentItem[];
    topSlotItems: MenuContentItem[];
    productItems: MenuContentItem[];
    pillItems: MenuContentItem[];
}

export function headerContentFactory(service: LazyClientConfigService) {
    return service.get(HeaderConfig);
}
