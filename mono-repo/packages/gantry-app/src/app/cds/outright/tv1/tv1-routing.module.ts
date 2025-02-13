import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeOutrightTv1Component } from '../../dark-theme-outright/dark-theme-outright-tv1/dark-theme-outright-tv1.component';

const routes: Routes = [
    {
        path: 'outright/latestdesign',
        component: DarkThemeOutrightTv1Component,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tv1RoutingModule {}
