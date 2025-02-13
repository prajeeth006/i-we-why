import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeFootBallCdsTemplateComponent } from '../../../dark-theme-matches/dark-theme-foot-ball-cds-template/dark-theme-foot-ball-cds-template.component';

const routes: Routes = [
    {
        path: '',
        component: DarkThemeFootBallCdsTemplateComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FootBallCdsLatestRoutingModule {}
