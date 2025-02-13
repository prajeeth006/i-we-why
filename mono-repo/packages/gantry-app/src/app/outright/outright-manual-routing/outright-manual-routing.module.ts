import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeManualOutrightTemplateComponent } from '../../dark-theme-outright/components/dark-theme-manual-outright-template/dark-theme-manual-outright-template.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeManualOutrightTemplateComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OutrightManualRoutingModule {}
