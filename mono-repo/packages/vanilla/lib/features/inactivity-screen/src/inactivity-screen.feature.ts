import { runOnFeatureInit } from '@frontend/vanilla/core';

import { InactivityScreenBootstrapService } from './inactivity-screen-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(InactivityScreenBootstrapService)];
}
