import { Injectable } from '@angular/core';

import {
    LoginResponseHandlerContext,
    LoginResponseHandlerHook,
    ToastrQueueService,
    ToastrSchedule,
    ToastrType,
    TrackingService,
} from '@frontend/vanilla/core';

import { LoginService } from '../login.service';

@Injectable()
export class TrackingLoginResponseHandlerHook implements LoginResponseHandlerHook {
    constructor(
        private toastrQueueService: ToastrQueueService,
        private trackingService: TrackingService,
        private loginService: LoginService,
    ) {}

    async onPostLogin(context: LoginResponseHandlerContext) {
        //TODO moved here for now as login is always executed. should be moved somewhere else
        this.loginService.logSuperCookie('onPostLogin');
        const schedule = context.willRedirectAfterLogin ? ToastrSchedule.AfterNextNavigation : ToastrSchedule.Immediate;
        this.toastrQueueService.add(ToastrType.AutoLogoutMultipleActiveSessions, { schedule });
        this.toastrQueueService.add(ToastrType.SingleAccount, { schedule });
        this.toastrQueueService.add(ToastrType.MigratedPlayerOnboarding, { schedule });
        //END

        await this.trackingService.updateUserValues();
    }
}
