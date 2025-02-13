import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnSessionLimitsLogoutPopup', product: ClientConfigProductName.SF })
@Injectable()
export class SessionLimitsLogoutPopupConfig extends LazyClientConfigBase {
    content: ViewTemplateForClient;
}

export function sessionLimitsLogoutPopupContentFactory(service: LazyClientConfigService) {
    return service.get(SessionLimitsLogoutPopupConfig);
}
