import { Injectable } from '@angular/core';

import { ClientConfigProductName, GenericListItem, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnActivityPopup', product: ClientConfigProductName.SF })
@Injectable()
export class ActivityPopupConfig extends LazyClientConfigBase {
    timeout: number;
    resources: GenericListItem;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(ActivityPopupConfig);
}
