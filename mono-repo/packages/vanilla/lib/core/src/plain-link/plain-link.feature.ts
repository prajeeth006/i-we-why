import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { PlainLinkBootstrapService } from './plain-link-bootstrap.service';

export function providePlainLink(): Provider[] {
    return [runOnAppInit(PlainLinkBootstrapService)];
}
