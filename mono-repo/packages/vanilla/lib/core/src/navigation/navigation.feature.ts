import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { NavigationBootstrapService } from './navigation-bootstrap.service';

export function provideNavigation(): Provider[] {
    return [runOnAppInit(NavigationBootstrapService)];
}
