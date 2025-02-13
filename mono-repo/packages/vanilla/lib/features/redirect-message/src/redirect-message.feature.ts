import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { RedirectMessageBootstrapService } from './redirect-message-bootstrap.service';
import { RedirectMessageTrackingService } from './redirect-message-tracking.service';
import { RedirectMessageConfig, redirectMessageConfigFactory } from './redirect-message.client-config';
import { RedirectMessageService } from './redirect-message.service';

export function provide() {
    return [
        RedirectMessageService,
        RedirectMessageTrackingService,
        { provide: RedirectMessageConfig, useFactory: redirectMessageConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(RedirectMessageBootstrapService),
    ];
}
