import { Injectable } from '@angular/core';

import { LogoutStage, OnLogoutProvider } from '@frontend/vanilla/core';
import { LimitsService } from '@frontend/vanilla/shared/limits';

import { LogoutResourceService } from './logout-resource.service';
import { LogoutConfig, LogoutMessageType } from './logout.client-config';

@Injectable()
export class LimitsLogoutProvider implements OnLogoutProvider {
    constructor(
        private limitsService: LimitsService,
        private logoutResourceService: LogoutResourceService,
        private config: LogoutConfig,
    ) {}

    get stage(): LogoutStage {
        return LogoutStage.BEFORE_LOGOUT;
    }

    async onLogout(): Promise<any> {
        if (this.config.logoutMessage === LogoutMessageType.LOGOUT_MESSAGE_LIMITS) {
            this.logoutResourceService.logoutPlaceholders = await this.limitsService.getToasterPlaceholders();
        }
        return Promise.resolve();
    }
}
