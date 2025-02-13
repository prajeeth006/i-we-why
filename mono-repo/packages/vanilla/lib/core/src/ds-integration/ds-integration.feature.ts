import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { DsIntegrationBootstrapService } from './ds-integration-bootstrap.service';

export function provideDsIntegration(): Provider[] {
    return [runOnAppInit(DsIntegrationBootstrapService)];
}
