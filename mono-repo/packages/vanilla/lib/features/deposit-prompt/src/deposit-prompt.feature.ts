import { LOGIN_RESPONSE_HANDLER_HOOK, LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { DepositPromptBootstrapService } from './deposit-prompt-bootstrap.service';
import { DepositPromptConfig, depositPromptConfigFactory } from './deposit-prompt.client-config';
import { DepositPromptService } from './deposit-prompt.service';
import { ToastsLoginResponseHandlerHook } from './toasts-login-response-handler-hook';

export function provide() {
    return [
        { provide: DepositPromptConfig, deps: [LazyClientConfigService], useFactory: depositPromptConfigFactory },
        DepositPromptService,
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: ToastsLoginResponseHandlerHook, multi: true },
        runOnFeatureInit(DepositPromptBootstrapService),
    ];
}
