import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeWinningDistanceComponent } from '../../dark-theme/components/dark-theme-winning-distance/dark-theme-winning-distance.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeWinningDistanceComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WinningDistanceRoutingModule {}
