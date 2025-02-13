import { Injectable } from '@angular/core';

import { LoginResponseHandlerContext, LoginResponseHandlerHook, NavigationService, UserService } from '@frontend/vanilla/core';
import { first } from 'rxjs/operators';

import { UserSummaryCookieService } from './user-summary-cookie.service';
import { UserSummaryOverlayService } from './user-summary-overlay.service';
import { UserSummaryConfig } from './user-summary.client-config';

@Injectable()
export class UserSummaryLoginResponseHandlerHook implements LoginResponseHandlerHook {
    private get shouldShowOverlay(): boolean {
        return !this.config.skipOverlay && this.user.realPlayer;
    }

    constructor(
        private user: UserService,
        private config: UserSummaryConfig,
        private userSummaryOverlayService: UserSummaryOverlayService,
        private userSummaryCookieService: UserSummaryCookieService,
        private navigation: NavigationService,
    ) {}

    onPostLogin(context: LoginResponseHandlerContext) {
        if (context.usesDefaultPostLoginAction) {
            if (context.willRedirectAfterLogin) {
                this.userSummaryCookieService.write();
                // subscribe to locationChange and show overlay after the next navigation.
                if (this.shouldShowOverlay) {
                    this.navigation.locationChange.pipe(first()).subscribe(() => {
                        this.userSummaryOverlayService.init();
                    });
                }
            } else {
                if (this.shouldShowOverlay) {
                    this.userSummaryOverlayService.init();
                } else if (!this.userSummaryCookieService.read()) {
                    // write cookie so overlay can be shown on product where it is enabled.
                    this.userSummaryCookieService.write();
                }
            }
        }
    }
}
