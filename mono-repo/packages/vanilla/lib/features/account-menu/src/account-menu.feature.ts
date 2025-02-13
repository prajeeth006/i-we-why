import { runOnFeatureInit } from '@frontend/vanilla/core';

import { AccountMenuBootstrapService } from './account-menu-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(AccountMenuBootstrapService)];
}
