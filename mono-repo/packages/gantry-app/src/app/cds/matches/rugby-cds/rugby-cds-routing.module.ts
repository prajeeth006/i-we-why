import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeRubyCdsComponent } from '../../dark-theme-matches/dark-theme-rugby-cds/components/dark-theme-rugby-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeRubyCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RugbyCdsRoutingModule {}
