import { Routes } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { ProfilePageComponent } from './profile-page.component';
import { profilePageGuard } from './profile-page.guard';

export const PROFILEPAGE_ROUTES: Routes = [
    {
        path: '',
        component: ProfilePageComponent,
        data: routeData({ authorized: true }),
        canActivate: [profilePageGuard],
    },
];
