import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeDartCdsComponent } from '../../dark-theme-matches/dark-theme-dart-cds/components/dark-theme-dart-cds.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeDartCdsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DartCdsRoutingModule {}
