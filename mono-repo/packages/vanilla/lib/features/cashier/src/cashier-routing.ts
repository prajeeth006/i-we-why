import { Route } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { CashierComponent } from './cashier.component';
import { quickDepositGuard } from './quick-deposit/quick-deposit.guard';

export const ROUTES: Route[] = [
    {
        path: ':action',
        component: CashierComponent,
        canActivate: [quickDepositGuard],
        data: routeData({ authorized: true }),
    },
    {
        path: '',
        component: CashierComponent,
        data: routeData({ authorized: true }),
    },
];
