import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeSnookerCdsComponent } from '../../dark-theme-matches/dark-theme-snooker-cds/components/dark-theme-snooker-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeSnookerCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SnookerCdsRoutingModule {}
