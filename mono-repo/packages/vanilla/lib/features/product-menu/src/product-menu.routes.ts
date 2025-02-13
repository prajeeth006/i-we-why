import { Routes } from '@angular/router';

import { ProductMenuViewComponent } from './product-menu-view.component';

export const ROUTES: Routes = [
    {
        path: '**',
        component: ProductMenuViewComponent,
    },
];
