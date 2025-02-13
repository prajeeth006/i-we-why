import { runOnFeatureInit } from '@frontend/vanilla/core';

import { FooterBootstrapService } from './footer-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(FooterBootstrapService)];
}
