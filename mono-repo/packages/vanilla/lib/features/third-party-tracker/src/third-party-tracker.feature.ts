import { runOnFeatureInit } from '@frontend/vanilla/core';

import { ThirdPartyTrackerBootstrapService } from './third-party-tracker-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(ThirdPartyTrackerBootstrapService)];
}
