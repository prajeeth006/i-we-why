import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { CookieConsentBootstrapService } from './cookie-consent-bootstrap.service';
import { CookieConsentTrackingService } from './cookie-consent-tracking.service';
import { CookieConsentConfig, cookieConsentConfigFactory } from './cookie-consent.client-config';
import { CookieConsentService } from './cookie-consent.service';

export function provide() {
    return [
        { provide: CookieConsentConfig, useFactory: cookieConsentConfigFactory, deps: [LazyClientConfigService] },
        CookieConsentTrackingService,
        CookieConsentService,
        runOnFeatureInit(CookieConsentBootstrapService),
    ];
}
