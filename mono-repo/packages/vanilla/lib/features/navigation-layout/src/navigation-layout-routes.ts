import { Routes } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { NavigationLayoutCashierComponent } from './navigation-layout-cashier.component';
import { NavigationLayoutMenuPageComponent } from './navigation-layout-menu-page.component';

export const NAVIGATIONLAYOUT_ROUTES: Routes = [
    {
        path: 'cashier/:page',
        component: NavigationLayoutCashierComponent,
        data: routeData({ authorized: true }),
    },
    {
        path: 'navigation/:itemName', // note: not sure if this one is needed anymore
        component: NavigationLayoutMenuPageComponent,
        data: routeData({ authorized: true }),
    },
];
