import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeEpsTemplateComponent } from './dark-theme-eps-template.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeEpsTemplateComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DarkThemeEpsRoutingModule {}
