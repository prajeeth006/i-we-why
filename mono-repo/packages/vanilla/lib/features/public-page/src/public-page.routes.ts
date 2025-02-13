import { Routes } from '@angular/router';

import { PublicPageLoaderComponent } from './public-page-loader.component';

export const ROUTES: Routes = [
    {
        path: '**',
        component: PublicPageLoaderComponent,
    },
];
