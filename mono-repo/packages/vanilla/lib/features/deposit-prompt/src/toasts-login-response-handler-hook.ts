import { Injectable } from '@angular/core';

import { LoginResponseHandlerContext, LoginResponseHandlerHook } from '@frontend/vanilla/core';

import { DepositPromptService } from './deposit-prompt.service';

@Injectable()
export class ToastsLoginResponseHandlerHook implements LoginResponseHandlerHook {
    constructor(private depositPromptService: DepositPromptService) {}

    async onPostLogin(context: LoginResponseHandlerContext) {
        if (context.usesDefaultPostLoginAction) {
            await this.depositPromptService.postLogin({ willRedirect: context.willRedirectAfterLogin });
        }
    }
}
