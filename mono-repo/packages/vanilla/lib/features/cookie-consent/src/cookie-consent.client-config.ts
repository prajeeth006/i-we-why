import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnCookieConsent', product: ClientConfigProductName.SF })
@Injectable()
export class CookieConsentConfig extends LazyClientConfigBase {
    condition: string;
    content: ViewTemplate;
}

export function cookieConsentConfigFactory(service: LazyClientConfigService) {
    return service.get(CookieConsentConfig);
}
