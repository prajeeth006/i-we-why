import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeGreyhoundsMeetingResultsComponent } from '../../dark-theme/components/dark-theme-greyhounds-meeting-results/dark-theme-greyhounds-meeting-results.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeGreyhoundsMeetingResultsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GreyhoundMeetingResultsRoutingModule {}
