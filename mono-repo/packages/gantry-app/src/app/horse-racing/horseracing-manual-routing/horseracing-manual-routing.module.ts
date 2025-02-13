import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeManualHorseRacingTemplateComponent } from '../dark-theme/components/dark-theme-manual-horse-racing-template/dark-theme-manual-horse-racing-template.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeManualHorseRacingTemplateComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorseracingManualRoutingModule {}
