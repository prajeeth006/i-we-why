import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnDebounceButtons', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: debounceButtonsConfigFactory,
    deps: [LazyClientConfigService],
})
export class DebounceButtonsConfig extends LazyClientConfigBase {
    items: MenuContentItem[];
}

export function debounceButtonsConfigFactory(service: LazyClientConfigService) {
    return service.get(DebounceButtonsConfig);
}
