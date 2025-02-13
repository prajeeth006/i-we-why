import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeBoxingCdsComponent } from '../../dark-theme-matches/dark-theme-boxing/dark-theme-boxing-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeBoxingCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BoxingCdsRoutingModule {}
