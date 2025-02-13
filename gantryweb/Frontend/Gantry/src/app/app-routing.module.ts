import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: ':culture',
  children: [
    {
      path: 'gantry',
      children: [
        {
          path: 'horseracing',
          loadChildren: () => import('./horse-racing/horse-racing.module').then(m => m.HorseRacingModule)
        },
        {
          path: 'staticpromotion',
          loadChildren: () => import('./horse-racing/components/static-promotion/static-promotion.module').then(m => m.StaticPromotionModule)
        },
        {
          path: 'moneyboost',
          loadChildren: () => import('./horse-racing/components/money-boost/money-boost.module').then(m => m.MoneyBoostModule)
        },
        {
          path: 'howfar',
          loadChildren: () => import('./horse-racing/components/how-far/how-far.module').then(m => m.HowFarModule)
        },
        {
          path: 'hotshow',
          loadChildren: () => import('./horse-racing/other-modules/hot-show/hot-show.module').then(m => m.HotShowModule)
        },
        {
          path: 'runningontotals',
          loadChildren: () => import('./horse-racing/other-modules/running-on-totals/running-on-totals.module').then(m => m.RunningOnTotalsModule)
        },
        {
          path: 'matchbets',
          loadChildren: () => import('./horse-racing/components/match-bets/match-bets.module').then(m => m.MatchBetsModule)
        },
        {
          path: 'nonrunners',
          loadChildren: () => import('./horse-racing/components/non-runners/non-runners.module').then(m => m.NonRunnersModule)
        },
        {
          path: 'horseracing/antepost',
          loadChildren: () => import('./horse-racing/components/ante-post/ante-post.module').then(m => m.HorseRacingAntePostModule)
        },
        {
          path: 'horseracing/meetingresults',
          loadChildren: () => import('./horse-racing/components/meeting-results/horse-racing-meeting-results.module').then(m => m.HorseRacingMeetingResultsModule)
        },
        {
          path: 'latestresults',
          loadChildren: () => import('./latest-results/latest-results.module').then(m => m.LatestResultsModule)
        },
        {
          path: 'horseracing/winning-distance',
          loadChildren: () => import('./horse-racing/components/winning-distance/winning-distance.module').then(m => m.WinningDistanceModule)
        },
        {
          path: 'greyhoundsracing',
          loadChildren: () => import('./greyhound-racing/greyhound-racing.module').then(m => m.GreyhoundRacingModule)
        },
        {
          path: 'greyhoundsracing/antepost',
          loadChildren: () => import('./greyhound-racing/components/ante-post/ante-post.module').then(m => m.GreyHoundRacingAntePostModule)
        },
        {
          path: 'greyhoundsracing/moneybox',
          loadChildren: () => import('./greyhound-racing/components/moneybox/moneybox.module').then(m => m.MoneyboxModule)
        },
        {
          path: 'greyhoundsracing/meetingresults',
          loadChildren: () => import('./greyhound-racing/components/meeting-results/greyhound-meeting-results.module').then(m => m.GreyhoundMeetingResultsModule)
        },
        {
          path: 'greyhoundsracing/antepostdraw',
          loadChildren: () => import('./greyhound-racing/components/ante-post-draw/ante-post-draw.module').then(m => m.GreyHoundRacingAntePostDrawModule)
        },
        {
          path: 'greyhoundsracing/trapchallenge',
          loadChildren: () => import('./greyhound-racing/components/trap-challenge/trap-challenge.module').then(m => m.TrapChallengeModule)
        },
        {
          path: 'nrm',
          loadChildren: () => import('./nrm/nrm.module').then(m => m.NrmModule)
        },
        {
          path: 'cricket',
          loadChildren: () => import('./cricket/cricket.module').then(m => m.CricketModule)
        },
        {
          path: 'football/home-draw-away',
          loadChildren: () => import('./foot-ball/components/home-draw-away/home-draw-away.module').then(m => m.HomeDrawAwayModule)
        },
        {
          path: 'football',
          loadChildren: () => import('./foot-ball/foot-ball.module').then(m => m.FootBallModule)
        },
        {
          path: 'nfl',
          loadChildren: () => import('./foot-ball/foot-ball.module').then(m => m.FootBallModule)
        },
        {
          path: 'tennis',
          loadChildren: () => import('./tennis/tennis.module').then(m => m.TennisModule)
        },
        {
          path: 'multiview',
          loadChildren: () => import('./multiview/multiview.module').then(m => m.MultiviewModule)
        },
        {
          path: 'carousel',
          loadChildren: () => import('./carousel/carousel.module').then(m => m.CarouselModule)
        },
        {
          path: 'boxing',
          loadChildren: () => import('./boxing/boxing.module').then(m => m.BoxingModule)
        },
        {
          path: 'rugby',
          loadChildren: () => import('./foot-ball/foot-ball.module').then(m => m.FootBallModule)
        },
        {
          path: 'snooker',
          loadChildren: () => import('./snooker/snooker.module').then(m => m.SnookerModule)
        },
        {
          path: 'dart',
          loadChildren: () => import('./dart/dart.module').then(m => m.DartModule)
        },
        {
          path: 'formula1',
          loadChildren: () => import('./formula1/formula1.module').then(m => m.Formula1Module)
        },
        {
          path: 'outright',
          loadChildren: () => import('./outright/outright.module').then(m => m.OutrightModule)
        },
        {
          path: 'avr',
          loadChildren: () => import('./avr/avr.module').then(m => m.AvrModule)
        },
        {
          path: 'eps',
          loadChildren: () => import('./horse-racing/components/eps/eps.module').then(m => m.EpsModule)
        },
        {
          path: 'cds',
          loadChildren: () => import('./cds/cds.module').then(m => m.CdsModule)
        },
      ]
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
