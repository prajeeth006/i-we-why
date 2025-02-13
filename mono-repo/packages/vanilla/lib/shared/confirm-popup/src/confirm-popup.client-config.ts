import { Injectable } from '@angular/core';

import { ClientConfigProductName, GenericListItem, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnConfirmPopup', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: confirmPopupConfigFactory,
})
export class ConfirmPopupConfig extends LazyClientConfigBase {
    resources: GenericListItem;
}

export function confirmPopupConfigFactory(service: LazyClientConfigService) {
    return service.get(ConfirmPopupConfig);
}
