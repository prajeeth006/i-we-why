import { runOnFeatureInit } from '@frontend/vanilla/core';

import { PageMatrixBootstrapService } from './page-matrix-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(PageMatrixBootstrapService)];
}
