import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

export interface CssOverride {
    id: string;
    content: string;
    condition?: string;
}

@LazyClientConfig({ key: 'vnCssOverrides', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: configFactory,
    deps: [LazyClientConfigService],
})
export class CssOverridesConfig extends LazyClientConfigBase {
    items: CssOverride[];
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(CssOverridesConfig);
}
