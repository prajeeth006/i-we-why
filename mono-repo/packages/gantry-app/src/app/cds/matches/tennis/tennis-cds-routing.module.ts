import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeTennisCdsComponent } from '../../dark-theme-matches/dark-theme-tennis/dark-theme-tennis-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeTennisCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TennisCdsRoutingModule {}
