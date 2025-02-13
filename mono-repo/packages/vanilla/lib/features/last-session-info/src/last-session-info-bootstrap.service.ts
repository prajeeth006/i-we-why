import { Inject, Injectable } from '@angular/core';

import { LOGIN_RESPONSE_HANDLER_HOOK, LoginResponseHandlerHook, LoginResponseHandlerService, OnFeatureInit } from '@frontend/vanilla/core';

@Injectable()
export class LastSessionInfoBootstrapService implements OnFeatureInit {
    constructor(
        private loginResponseHandlerService: LoginResponseHandlerService,
        @Inject(LOGIN_RESPONSE_HANDLER_HOOK) private loginResponseHandlerHooks: LoginResponseHandlerHook[],
    ) {}

    onFeatureInit() {
        this.loginResponseHandlerService.registerHooks(this.loginResponseHandlerHooks);
    }
}
