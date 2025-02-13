import { LazyClientConfigService, registerEventProcessor } from '@frontend/vanilla/core';

import { LossLimitsProcessor } from './loss-limit-processor';
import { LossLimitsTrackingService } from './loss-limit-tracking-service';
import { LossLimitsOverlayService } from './loss-limits-overlay.service';
import { LossLimitsConfig, lossLimitsConfigFactory } from './loss-limits.client-config';

export function provide() {
    return [
        LossLimitsOverlayService,
        LossLimitsTrackingService,
        { provide: LossLimitsConfig, useFactory: lossLimitsConfigFactory, deps: [LazyClientConfigService] },
        registerEventProcessor(LossLimitsProcessor),
    ];
}
