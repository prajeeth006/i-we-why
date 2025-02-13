import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { DynamicLayoutBootstrapService } from './dynamic-layout-bootstrap.service';

export function provideDynamicLayout(): Provider[] {
    return [runOnAppInit(DynamicLayoutBootstrapService)];
}
