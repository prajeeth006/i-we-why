import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeGolfCdsComponent } from '../../dark-theme-matches/dark-theme-golf-cds/dark-theme-golf-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeGolfCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GolfCdsRoutingModule {}
