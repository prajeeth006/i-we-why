import { Routes } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { RememberMeLogoutPromptComponent } from './remember-me-logout-prompt.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: RememberMeLogoutPromptComponent,
        data: routeData({ allowAnonymous: true }),
    },
];
