import { LOGIN_RESPONSE_HANDLER_HOOK, LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { SessionLimitsBootstrapService } from './session-limits-bootstrap.service';
import { SessionLimitsLoginResponseHandlerHook } from './session-limits-login-response-handler-hook';
import { SessionLimitsOverlayService } from './session-limits-overlay.service';
import { SessionLimitsTrackingService } from './session-limits-tracking.service';
import { SessionLimitsConfig, sessionLimitsConfigFactory } from './session-limits.client-config';

export function provide() {
    return [
        { provide: SessionLimitsConfig, useFactory: sessionLimitsConfigFactory, deps: [LazyClientConfigService] },
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: SessionLimitsLoginResponseHandlerHook, multi: true },
        SessionLimitsOverlayService,
        SessionLimitsTrackingService,
        runOnFeatureInit(SessionLimitsBootstrapService),
    ];
}
