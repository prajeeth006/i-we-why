import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeHorseMeetingResultsComponent } from '../../dark-theme/components/dark-theme-horse-meeting-results/dark-theme-horse-meeting-results.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeHorseMeetingResultsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorseRacingMeetingResultsRoutingModule {}
