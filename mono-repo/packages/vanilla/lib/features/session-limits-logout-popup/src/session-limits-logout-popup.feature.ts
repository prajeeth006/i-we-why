import { LazyClientConfigService, registerEventProcessor } from '@frontend/vanilla/core';

import { SessionLimitsLogoutPopupProcessor } from './session-limits-logout-popup-processor';
import { SessionLimitsLogoutPopupConfig, sessionLimitsLogoutPopupContentFactory } from './session-limits-logout-popup.client-config';
import { SessionLimitsLogoutPopupService } from './session-limits-logout-popup.service';

export function provide() {
    return [
        { provide: SessionLimitsLogoutPopupConfig, useFactory: sessionLimitsLogoutPopupContentFactory, deps: [LazyClientConfigService] },
        SessionLimitsLogoutPopupService,
        registerEventProcessor(SessionLimitsLogoutPopupProcessor),
    ];
}
