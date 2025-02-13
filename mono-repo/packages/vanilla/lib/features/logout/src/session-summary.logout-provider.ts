import { Injectable } from '@angular/core';

import { AuthService, IntlService, LogoutStage, OnLogoutProvider } from '@frontend/vanilla/core';
import { SessionFundSummaryService } from '@frontend/vanilla/shared/session-fund-summary';

import { LogoutResourceService } from './logout-resource.service';
import { LogoutConfig, LogoutMessageType } from './logout.client-config';

@Injectable()
export class SessionSummaryLogoutProvider implements OnLogoutProvider {
    constructor(
        private authService: AuthService,
        private sessionFundSummary: SessionFundSummaryService,
        private logoutResourceService: LogoutResourceService,
        private intlService: IntlService,
        private config: LogoutConfig,
    ) {}

    get stage(): LogoutStage {
        return LogoutStage.BEFORE_LOGOUT;
    }

    async onLogout(): Promise<any> {
        if (this.config.logoutMessage === LogoutMessageType.LOGOUT_MESSAGE_SESSION_SUMMARY) {
            const duration = await this.authService.duration();
            const sessionFundSummary = await this.sessionFundSummary.refresh();

            this.logoutResourceService.logoutPlaceholders = {
                balance: this.intlService.formatCurrency(sessionFundSummary?.currentBalance ?? 0),
                timeElapsed: duration,
                winningsLosses: this.intlService.formatCurrency((sessionFundSummary?.profit ?? 0) - (sessionFundSummary?.loss ?? 0)),
            };
        }
        return Promise.resolve();
    }
}
