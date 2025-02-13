import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnLanguageSwitcher', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: configFactory,
})
export class LanguageSwitcherConfig extends LazyClientConfigBase {
    isEnabledDslExpression: string;
    openPopupDslExpression: string;
    showHeaderDslExpression: string;
    version: number;
    useFastIcons: boolean;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(LanguageSwitcherConfig);
}
