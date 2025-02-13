import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: ':culture',
        children: [
            {
                path: 'gantry',
                children: [
                    {
                        path: 'horseracing',
                        loadChildren: () => import('./horse-racing/horse-racing.module').then((m) => m.HorseRacingModule),
                    },
                    {
                        path: 'staticpromotion',
                        loadChildren: () =>
                            import('./horse-racing/components/static-promotion/static-promotion.module').then((m) => m.StaticPromotionModule),
                    },
                    {
                        path: 'moneyboost',
                        loadChildren: () => import('./horse-racing/components/money-boost/money-boost.module').then((m) => m.MoneyBoostModule),
                    },
                    {
                        path: 'howfar',
                        loadChildren: () => import('./horse-racing/components/how-far/how-far.module').then((m) => m.HowFarModule),
                    },
                    {
                        path: 'hotshow',
                        loadChildren: () => import('./horse-racing/other-modules/hot-show/hot-show.module').then((m) => m.HotShowModule),
                    },
                    {
                        path: 'runningontotals',
                        loadChildren: () =>
                            import('./horse-racing/other-modules/running-on-totals/running-on-totals.module').then((m) => m.RunningOnTotalsModule),
                    },
                    {
                        path: 'matchbets',
                        loadChildren: () => import('./horse-racing/components/match-bets/match-bets.module').then((m) => m.MatchBetsModule),
                    },
                    {
                        path: 'nonrunners',
                        loadChildren: () => import('./horse-racing/components/non-runners/non-runners.module').then((m) => m.NonRunnersModule),
                    },

                    {
                        path: 'latestresults',
                        loadChildren: () => import('./latest-results/latest-results.module').then((m) => m.LatestResultsModule),
                    },
                    {
                        path: 'greyhoundsracing',
                        loadChildren: () => import('./greyhound-racing/greyhound-racing.module').then((m) => m.GreyhoundRacingModule),
                    },
                    {
                        path: 'greyhoundsracing/antepost',
                        loadChildren: () =>
                            import('./greyhound-racing/components/ante-post/ante-post.module').then((m) => m.GreyHoundRacingAntePostModule),
                    },
                    {
                        path: 'greyhoundsracing/moneybox',
                        loadChildren: () => import('./greyhound-racing/components/moneybox/moneybox.module').then((m) => m.MoneyboxModule),
                    },
                    {
                        path: 'greyhoundsracing/meetingresults',
                        loadChildren: () =>
                            import('./greyhound-racing/components/meeting-results/greyhound-meeting-results.module').then(
                                (m) => m.GreyhoundMeetingResultsModule,
                            ),
                    },
                    {
                        path: 'greyhoundsracing/antepostdraw',
                        loadChildren: () =>
                            import('./greyhound-racing/components/ante-post-draw/ante-post-draw.module').then(
                                (m) => m.GreyHoundRacingAntePostDrawModule,
                            ),
                    },
                    {
                        path: 'greyhoundsracing/trapchallenge',
                        loadChildren: () =>
                            import('./greyhound-racing/components/trap-challenge/trap-challenge.module').then((m) => m.TrapChallengeModule),
                    },
                    {
                        path: 'nrm',
                        loadChildren: () => import('./nrm/nrm.module').then((m) => m.NrmModule),
                    },
                    {
                        path: 'multiview',
                        loadChildren: () => import('./multiview/multiview.module').then((m) => m.MultiviewModule),
                    },
                    {
                        path: 'carousel',
                        loadChildren: () => import('./carousel/carousel.module').then((m) => m.CarouselModule),
                    },
                    {
                        path: 'outright',
                        loadChildren: () => import('./outright/outright.module').then((m) => m.OutrightModule),
                    },
                    {
                        path: 'avr',
                        loadChildren: () => import('./avr/avr.module').then((m) => m.AvrModule),
                    },
                    {
                        path: 'eps',
                        loadChildren: () =>
                            import('./horse-racing/dark-theme/components/dark-theme-eps/dark-theme-eps.module').then((m) => m.EpsModule),
                    },
                    {
                        path: 'cds',
                        loadChildren: () => import('./cds/cds.module').then((m) => m.CdsModule),
                    },
                    {
                        path: 'dash',
                        loadChildren: () => import('./dash-stream/dash-stream.module').then((m) => m.DashStreamModule),
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
