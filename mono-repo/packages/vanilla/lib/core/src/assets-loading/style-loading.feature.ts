import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { LazyAssetsBootstrapService } from './lazy-assets-bootstrap.service';

export function provideStyleLoading(): Provider[] {
    return [runOnAppInit(LazyAssetsBootstrapService)];
}
