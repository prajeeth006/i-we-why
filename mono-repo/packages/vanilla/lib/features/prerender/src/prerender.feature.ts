import { runOnFeatureInit } from '@frontend/vanilla/core';

import { PrerenderBootstrapService } from './prerender-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(PrerenderBootstrapService)];
}
