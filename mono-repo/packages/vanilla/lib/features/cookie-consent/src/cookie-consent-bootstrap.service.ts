import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { CookieConsentService } from './cookie-consent.service';

@Injectable()
export class CookieConsentBootstrapService implements OnFeatureInit {
    constructor(private cookieConsentService: CookieConsentService) {}

    onFeatureInit() {
        this.cookieConsentService.tryShowCookieConsent();
    }
}
