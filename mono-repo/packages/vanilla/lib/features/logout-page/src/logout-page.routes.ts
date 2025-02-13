import { Routes } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { LogoutPageResourceService } from './logout-page-resource.service';
import { LogoutPageComponent } from './logout-page.component';
import { logoutPageResolver } from './logout-page.resolver';

export const ROUTES: Routes = [
    {
        path: '',
        component: LogoutPageComponent,
        data: routeData({ allowAnonymous: true }),
        providers: [LogoutPageResourceService],
        resolve: {
            initData: logoutPageResolver,
        },
    },
];
