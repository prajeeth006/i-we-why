import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeGreyhoundRacingTemplateComponent } from './dark-theme/components/dark-theme-greyhound-racing-template/dark-theme-greyhound-racing-template.component';
import { DarkThemeManualGreyhoundRacingTemplateComponent } from './dark-theme/components/dark-theme-manual-greyhound-racing-template/dark-theme-manual-greyhound-racing-template.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeGreyhoundRacingTemplateComponent,
    },
    {
        path: 'manual/latestdesign',
        component: DarkThemeManualGreyhoundRacingTemplateComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GreyhoundRacingRoutingModule {}
