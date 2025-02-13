import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'latestdesign',
        loadChildren: () =>
            import('../horse-racing/horseracing-latest-routing/horseracing-latest-routing.module').then((m) => m.HorseracingLatestRoutingModule),
    },
    {
        path: 'manual',
        loadChildren: () =>
            import('../horse-racing/horseracing-manual-routing/horseracing-manual-routing.module').then((m) => m.HorseracingManualRoutingModule),
    },
    {
        path: 'antepost',
        loadChildren: () => import('../horse-racing/components/ante-post/ante-post.module').then((m) => m.HorseRacingAntePostModule),
    },
    {
        path: 'meetingresults',
        loadChildren: () =>
            import('../horse-racing/components/meeting-results/horse-racing-meeting-results.module').then((m) => m.HorseRacingMeetingResultsModule),
    },
    {
        path: 'winning-distance',
        loadChildren: () => import('../horse-racing/components/winning-distance/winning-distance.module').then((m) => m.WinningDistanceModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorseRacingRoutingModule {}
