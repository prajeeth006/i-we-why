import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { ActivityPopupBootstrapService } from './activity-popup-bootstrap.service';
import { ActivityPopupCookieService } from './activity-popup-cookie.service';
import { ActivityPopupOverlayService } from './activity-popup-overlay.service';
import { ActivityPopupTrackingService } from './activity-popup-tracking.service';
import { ActivityPopupConfig, configFactory } from './activity-popup.client-config';
import { ActivityPopupService } from './activity-popup.service';

export function provide() {
    return [
        ActivityPopupService,
        ActivityPopupOverlayService,
        ActivityPopupCookieService,
        ActivityPopupTrackingService,
        { provide: ActivityPopupConfig, useFactory: configFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(ActivityPopupBootstrapService),
    ];
}
