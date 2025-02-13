import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeHomeDrawAwayComponent } from '../../../dark-theme-matches/dark-theme-football/dark-theme-home-draw-away/dark-theme-home-draw-away.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeHomeDrawAwayComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FootBallCdsHomeDrawAwayRoutingModule {}
