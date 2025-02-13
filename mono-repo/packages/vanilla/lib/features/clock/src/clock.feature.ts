import { runOnFeatureInit } from '@frontend/vanilla/core';

import { ClockBootstrapService } from './clock-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(ClockBootstrapService)];
}
