import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeLatestFourResultsTemplateComponent } from './dark-theme/components/dark-theme-latest-four-results-template/dark-theme-latest-four-results-template.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeLatestFourResultsTemplateComponent,
    },
    {
        path: 'latestdesign/:latestsix',
        component: DarkThemeLatestFourResultsTemplateComponent,
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LatestResultsRoutingModule {}
