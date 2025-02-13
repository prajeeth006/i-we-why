import { Injectable } from '@angular/core';

import { AuthService, IntlService, LogoutStage, OnLogoutProvider, UserService } from '@frontend/vanilla/core';
import { UserSummaryService } from '@frontend/vanilla/shared/user-summary';
import { firstValueFrom } from 'rxjs';

import { LogoutResourceService } from './logout-resource.service';
import { LogoutConfig, LogoutMessageType } from './logout.client-config';

@Injectable()
export class StatsLogoutProvider implements OnLogoutProvider {
    constructor(
        private authService: AuthService,
        private userSummaryService: UserSummaryService,
        private logoutResourceService: LogoutResourceService,
        private intlService: IntlService,
        private userService: UserService,
        private config: LogoutConfig,
    ) {}

    get stage(): LogoutStage {
        return LogoutStage.BEFORE_LOGOUT;
    }

    async onLogout(): Promise<any> {
        if (this.config.logoutMessage === LogoutMessageType.LOGOUT_MESSAGE_WITH_STATS) {
            const duration = await this.authService.duration();
            const summary = await this.userSummaryService.refresh();
            const profitLoss = await firstValueFrom(this.logoutResourceService.getCurrentSessionProfitLoss());

            this.logoutResourceService.logoutPlaceholders = {
                displayName: this.userService.displayName,
                timeElapsed: duration,
                profit: this.intlService.formatCurrency(summary?.profit ?? 0),
                loss: this.intlService.formatCurrency(summary?.loss ?? 0),
                totalReturn: this.intlService.formatCurrency(profitLoss.totalReturn),
                totalStake: this.intlService.formatCurrency(profitLoss.totalStake),
            };
        }
        return Promise.resolve();
    }
}
