import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeHowFarComponent } from '../../dark-theme/components/dark-theme-how-far/dark-theme-how-far.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeHowFarComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HowFarRoutingModule {}
