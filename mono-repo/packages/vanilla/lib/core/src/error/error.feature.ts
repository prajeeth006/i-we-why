import { ErrorHandler, Provider } from '@angular/core';

import { RemoteLogger, defaultRemoteLogger } from '../logging/remote-logger';
import { VanillaErrorHandler } from './error-handler';

export function provideError(): Provider[] {
    return [
        { provide: RemoteLogger, useFactory: () => defaultRemoteLogger },
        { provide: ErrorHandler, useClass: VanillaErrorHandler },
    ];
}
