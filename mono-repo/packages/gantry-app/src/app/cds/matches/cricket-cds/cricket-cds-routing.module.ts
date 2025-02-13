import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeCricketCdsComponent } from '../../dark-theme-matches/dark-theme-cricket-cds/components/dark-theme-cricket-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeCricketCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CricketCdsRoutingModule {}
