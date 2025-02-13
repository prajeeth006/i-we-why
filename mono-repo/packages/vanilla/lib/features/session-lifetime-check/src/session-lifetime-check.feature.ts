import { runOnFeatureInit } from '@frontend/vanilla/core';

import { SessionLifetimeCheckBootstrapService } from './session-lifetime-check-bootstrap.service';
import { SessionLifetimeCheckService } from './session-lifetime-check.service';

export function provide() {
    return [SessionLifetimeCheckService, runOnFeatureInit(SessionLifetimeCheckBootstrapService)];
}
