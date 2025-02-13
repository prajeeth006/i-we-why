import { Injectable } from '@angular/core';

import { LoginResponseHandlerContext, LoginResponseHandlerHook, ToastrQueueService, ToastrSchedule, ToastrType } from '@frontend/vanilla/core';

@Injectable()
export class LastSessionInfoLoginHook implements LoginResponseHandlerHook {
    constructor(private toastrQueueService: ToastrQueueService) {}

    onPostLogin(context: LoginResponseHandlerContext) {
        if (context.usesDefaultPostLoginAction) {
            const schedule = context.willRedirectAfterLogin ? ToastrSchedule.AfterNextNavigation : ToastrSchedule.Immediate;

            this.toastrQueueService.add(ToastrType.LastSessionInfo, { schedule });
        }
    }
}
