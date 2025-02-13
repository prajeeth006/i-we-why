import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeMatchBetsComponent } from '../../dark-theme/components/dark-theme-match-bets/dark-theme-match-bets.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeMatchBetsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MatchBetsRoutingModule {}
