import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeFormula1CdsComponent } from '../../dark-theme-matches/dark-theme-formula1-cds/components/dark-theme-formula1-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeFormula1CdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Formula1CdsRoutingModule {}
