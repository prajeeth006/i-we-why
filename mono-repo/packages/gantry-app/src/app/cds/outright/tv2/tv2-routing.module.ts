import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeOutrightTv2Component } from '../../dark-theme-outright/dark-theme-outright-tv2/dark-theme-outright-tv2.component';

const routes: Routes = [
    {
        path: 'outright/latestdesign',
        component: DarkThemeOutrightTv2Component,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tv2RoutingModule {}
