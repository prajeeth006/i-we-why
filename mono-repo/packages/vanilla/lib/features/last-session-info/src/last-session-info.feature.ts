import { LOGIN_RESPONSE_HANDLER_HOOK, runOnFeatureInit } from '@frontend/vanilla/core';

import { LastSessionInfoBootstrapService } from './last-session-info-bootstrap.service';
import { LastSessionInfoLoginHook } from './last-session-info-login-hook';

export function provide() {
    return [
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: LastSessionInfoLoginHook, multi: true },
        runOnFeatureInit(LastSessionInfoBootstrapService),
    ];
}
