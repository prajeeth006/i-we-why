import { Injectable } from '@angular/core';

import { LoginResponseHandlerContext, LoginResponseHandlerHook, ToastrQueueService, ToastrSchedule, ToastrType } from '@frontend/vanilla/core';
import { LimitsService } from '@frontend/vanilla/shared/limits';
import { LoginConfig } from '@frontend/vanilla/shared/login';

@Injectable()
export class LimitsToastrLoginResponseHandlerHook implements LoginResponseHandlerHook {
    constructor(
        private limitsService: LimitsService,
        private toastrQueueService: ToastrQueueService,
        private config: LoginConfig,
    ) {}

    async onPostLogin(context: LoginResponseHandlerContext) {
        if (context.usesDefaultPostLoginAction && this.config.enableLimitsToaster) {
            const placeholders = await this.limitsService.getToasterPlaceholders();

            this.toastrQueueService.add(ToastrType.LoginLimits, {
                schedule:
                    context.willRedirectAfterLogin || this.toastrQueueService.currentToast
                        ? ToastrSchedule.AfterNextNavigation
                        : ToastrSchedule.Immediate,
                placeholders,
            });
        }
    }
}
