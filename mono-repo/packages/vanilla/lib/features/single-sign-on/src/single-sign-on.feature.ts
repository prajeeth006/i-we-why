import { runOnFeatureInit } from '@frontend/vanilla/core';

import { SingleSignOnBootstrapService } from './single-sign-on-bootstrap.service';
import { SingleSignOnService } from './single-sign-on.service';

export function provide() {
    return [SingleSignOnService, runOnFeatureInit(SingleSignOnBootstrapService)];
}
