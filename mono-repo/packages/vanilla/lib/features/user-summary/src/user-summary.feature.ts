import { LOGIN_RESPONSE_HANDLER_HOOK, LazyClientConfigService, registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { UserSummaryBootstrapService } from './user-summary-bootstrap.service';
import { UserSummaryCookieService } from './user-summary-cookie.service';
import { UserSummaryDslValuesProvider } from './user-summary-dsl-values-provider';
import { UserSummaryLoginResponseHandlerHook } from './user-summary-login-response-handler-hook';
import { UserSummaryOverlayService } from './user-summary-overlay.service';
import { UserSummaryConfig, userSummaryConfigFactory } from './user-summary.client-config';

export function provide() {
    return [
        UserSummaryCookieService,
        UserSummaryOverlayService,
        { provide: UserSummaryConfig, useFactory: userSummaryConfigFactory, deps: [LazyClientConfigService] },
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: UserSummaryLoginResponseHandlerHook, multi: true },
        runOnFeatureInit(UserSummaryBootstrapService),
        registerLazyDslOnModuleInit(UserSummaryDslValuesProvider),
    ];
}
