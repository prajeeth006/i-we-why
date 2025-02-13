import { Routes } from '@angular/router';

import { darkModeGuard } from './dark-mode.guard';
import { NavigationLayoutDarkModeComponent } from './navigation-layout-dark-mode.component';

export const DARKMODE_ROUTES: Routes = [
    {
        path: 'dark-mode',
        canActivate: [darkModeGuard],
        component: NavigationLayoutDarkModeComponent,
    },
];
