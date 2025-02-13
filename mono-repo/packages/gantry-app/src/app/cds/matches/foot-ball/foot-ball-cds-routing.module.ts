import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home-draw-away',
        loadChildren: () =>
            import('../foot-ball/foot-ball-cds-home-draw-away-routing/foot-ball-cds-home-draw-away-routing.module').then(
                (m) => m.FootBallCdsHomeDrawAwayRoutingModule,
            ),
    },
    {
        path: 'latestdesign',
        loadChildren: () =>
            import('../foot-ball/foot-ball-cds-latest-routing/foot-ball-cds-latest-routing.module').then((m) => m.FootBallCdsLatestRoutingModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FootBallCdsRoutingModule {}
