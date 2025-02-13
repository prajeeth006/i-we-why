import { Routes } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { BalanceBreakdownComponent } from './balance-breakdown.component';
import { provide } from './balance-breakdown.feature';

export const ROUTES: Routes = [
    {
        path: 'balancebreakdown',
        component: BalanceBreakdownComponent,
        data: routeData({ authorized: true }),
        providers: provide(),
    },
];
