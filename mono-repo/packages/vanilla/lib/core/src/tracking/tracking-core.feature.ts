import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { TrackingBootstrapService } from './tracking-core.bootstrap.service';

export function provideTracking(): Provider[] {
    return [runOnAppInit(TrackingBootstrapService)];
}
