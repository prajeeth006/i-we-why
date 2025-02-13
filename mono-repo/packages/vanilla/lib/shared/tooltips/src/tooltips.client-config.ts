import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnTooltips', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: tooltipsConfigFactory,
})
export class TooltipsConfig extends LazyClientConfigBase {
    isOnboardingTooltipsEnabled: boolean;
    isTutorialTooltipsEnabled: boolean;
    tutorials: { [type: string]: ViewTemplate };
    onboardings: { [type: string]: ViewTemplate };
}

export function tooltipsConfigFactory(service: LazyClientConfigService) {
    return service.get(TooltipsConfig);
}
