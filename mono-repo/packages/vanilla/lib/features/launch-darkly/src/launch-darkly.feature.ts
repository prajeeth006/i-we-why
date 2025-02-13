import { runOnFeatureInit } from '@frontend/vanilla/core';

import { LaunchDarklyBootstrapService } from './launch-darkly-bootstrap.service';

/**
 * @stable
 */
export function provide() {
    return [runOnFeatureInit(LaunchDarklyBootstrapService)];
}
