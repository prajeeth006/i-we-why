import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { LoggingBootstrapService } from './logging-bootstrap.service';

export function provideLogging(): Provider[] {
    return [runOnAppInit(LoggingBootstrapService)];
}
