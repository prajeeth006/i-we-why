import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeNflCdsComponent } from '../../dark-theme-matches/dark-theme-nfl-cds/dark-theme-nfl-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeNflCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NflCdsRoutingModule {}
