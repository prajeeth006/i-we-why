import { Inject, Injectable } from '@angular/core';

import { LOGIN_RESPONSE_HANDLER_HOOK, LoginResponseHandlerHook, LoginResponseHandlerService, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { DepositPromptConfig } from './deposit-prompt.client-config';
import { DepositPromptService } from './deposit-prompt.service';

@Injectable()
export class DepositPromptBootstrapService implements OnFeatureInit {
    constructor(
        private config: DepositPromptConfig,
        private depositPromptService: DepositPromptService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        @Inject(LOGIN_RESPONSE_HANDLER_HOOK) private toastLoginResponseHooks: LoginResponseHandlerHook[],
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.loginResponseHandlerService.registerHooks(this.toastLoginResponseHooks);
        this.depositPromptService.atStartup();
    }
}
