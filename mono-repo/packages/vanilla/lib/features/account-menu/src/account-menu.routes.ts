import { Routes } from '@angular/router';

import { AccountMenuViewComponent } from './account-menu-view.component';
import { accountMenuGuard } from './account-menu.guard';

export const ROUTES: Routes = [
    {
        path: '**',
        component: AccountMenuViewComponent,
        canActivate: [accountMenuGuard],
    },
];
