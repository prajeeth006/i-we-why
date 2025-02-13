import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { CookieName, CookieService, DynamicHtmlDirective } from '@frontend/vanilla/core';

import { COOKIE_CONSENT_ACCEPTED_VALUE } from './constants';
import { CookieConsentTrackingService } from './cookie-consent-tracking.service';
import { CookieConsentConfig } from './cookie-consent.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, OverlayModule, DynamicHtmlDirective],
    selector: 'vn-cookie-consent',
    templateUrl: 'cookie-consent.html',
})
export class CookieConsentComponent implements OnInit {
    constructor(
        public config: CookieConsentConfig,
        private overlayRef: OverlayRef,
        private cookieService: CookieService,
        private cookieConsentTrackingService: CookieConsentTrackingService,
    ) {}

    ngOnInit() {
        this.cookieConsentTrackingService.trackLoad();
    }

    close() {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        const value = this.cookieService.get(CookieName.EuConsent);
        this.cookieService.put(CookieName.EuConsent, COOKIE_CONSENT_ACCEPTED_VALUE, { expires });
        this.cookieConsentTrackingService.trackAccept(value);
        this.overlayRef.detach();
    }
}
