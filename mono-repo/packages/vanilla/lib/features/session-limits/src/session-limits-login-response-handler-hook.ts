import { Injectable, inject } from '@angular/core';

import { CookieName, CookieService, LoginResponseHandlerContext, LoginResponseHandlerHook, NavigationService } from '@frontend/vanilla/core';
import { first } from 'rxjs/operators';

import { SessionLimitsOverlayService } from './session-limits-overlay.service';
import { SessionLimitsConfig } from './session-limits.client-config';
import { SessionLimitNotification } from './session-limits.models';

@Injectable()
export class SessionLimitsLoginResponseHandlerHook implements LoginResponseHandlerHook {
    private sessionLimitsConfig = inject(SessionLimitsConfig);
    private sessionLimitsOverlayService = inject(SessionLimitsOverlayService);
    private navigation = inject(NavigationService);
    private cookieService = inject(CookieService);

    onPostLogin(context: LoginResponseHandlerContext) {
        const limitsResponse: string = context.response.postLoginValues?.loginSessionLimitsElapsed;

        if (!context.usesDefaultPostLoginAction || !limitsResponse) {
            return;
        }

        const limits: SessionLimitNotification = JSON.parse(limitsResponse);

        if (context.willRedirectAfterLogin) {
            this.cookieService.put(CookieName.SessionLimits, '1');

            // subscribe to locationChange and show overlay after the next navigation.
            if (!this.sessionLimitsConfig.skipOverlay) {
                this.navigation.locationChange.pipe(first()).subscribe(() => {
                    this.handlePostLoginOverlay(limits);
                });
            }
        } else {
            if (!this.sessionLimitsConfig.skipOverlay) {
                this.handlePostLoginOverlay(limits);
            } else if (!this.cookieService.get(CookieName.SessionLimits)) {
                // write cookie so overlay can be shown on product where it is enabled.
                this.cookieService.put(CookieName.SessionLimits, '1');
            }
        }
    }

    handlePostLoginOverlay(limits: SessionLimitNotification) {
        if (this.sessionLimitsConfig.version === 1) {
            this.sessionLimitsOverlayService.show(limits);
        } else {
            this.sessionLimitsOverlayService.handlePendingLimits({ ...limits, fromSource: 'postlogin' });
        }
    }
}
