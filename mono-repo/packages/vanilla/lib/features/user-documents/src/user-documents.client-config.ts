import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnUserDocuments', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: configFactory,
    deps: [LazyClientConfigService],
})
export class UserDocumentsConfig extends LazyClientConfigBase {
    depositLimitNoticeThreshold: number;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(UserDocumentsConfig);
}
