import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { MenuActionsBootstrapService } from '../menu-actions/menu-actions-bootstrap.service';
import { CcbBootstrapService } from './ccb-bootstrap.service';

export function provideMain(): Provider[] {
    return [runOnAppInit(MenuActionsBootstrapService), runOnAppInit(CcbBootstrapService)];
}
