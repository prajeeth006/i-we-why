import { Inject, Injectable } from '@angular/core';

import {
    LOGIN_RESPONSE_HANDLER_HOOK,
    LoginResponseHandlerHook,
    LoginResponseHandlerService,
    OnFeatureInit,
    UserService,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { UserSummaryCookieService } from './user-summary-cookie.service';
import { UserSummaryOverlayService } from './user-summary-overlay.service';
import { UserSummaryConfig } from './user-summary.client-config';

@Injectable()
export class UserSummaryBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private userSummaryConfig: UserSummaryConfig,
        private userSummaryOverlayService: UserSummaryOverlayService,
        private userSummaryCookieService: UserSummaryCookieService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        @Inject(LOGIN_RESPONSE_HANDLER_HOOK) private loginResponseHandlerHooks: LoginResponseHandlerHook[],
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.userSummaryConfig.whenReady);

        this.loginResponseHandlerService.registerHooks(this.loginResponseHandlerHooks);

        if (this.user.isAuthenticated && this.user.realPlayer && this.userSummaryCookieService.read()) {
            this.userSummaryOverlayService.init();
        }
    }
}
