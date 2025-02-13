import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { ToastrQueueBootstrapService } from './toastr-queue-bootstrap.service';

export function provideToastr(): Provider[] {
    return [runOnAppInit(ToastrQueueBootstrapService)];
}
