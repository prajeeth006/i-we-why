import { runOnFeatureInit } from '@frontend/vanilla/core';

import { LoginDurationBootstrapService } from './login-duration-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(LoginDurationBootstrapService)];
}
