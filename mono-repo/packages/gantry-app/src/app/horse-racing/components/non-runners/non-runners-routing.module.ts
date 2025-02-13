import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeNonRunnersComponent } from '../../dark-theme/components/dark-theme-non-runners/dark-theme-non-runners.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeNonRunnersComponent,
    },
    {
        path: 'latestdesign/:isUk',
        component: DarkThemeNonRunnersComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NonRunnersRoutingModule {}
