import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { SessionInfoBootstrapService } from './session-info-bootstrap.service';
import { SessionInfoOverlayService } from './session-info-overlay.service';
import { SessionInfoResourceService } from './session-info-resource.service';
import { SessionInfoConfig, sessionInfoConfigFactory } from './session-info.client-config';
import { SessionInfoService } from './session-info.service';

export function provide() {
    return [
        SessionInfoOverlayService,
        SessionInfoResourceService,
        SessionInfoService,
        runOnFeatureInit(SessionInfoBootstrapService),
        { provide: SessionInfoConfig, useFactory: sessionInfoConfigFactory, deps: [LazyClientConfigService] },
    ];
}
