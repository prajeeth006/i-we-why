import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'cricket',
    loadChildren: () => import('./matches/cricket-cds/cricket-cds.module').then(m => m.CricketCdsModule)
  },
  {
    path: 'nfl',
    loadChildren: () => import('./matches/nfl-cds/nfl-cds.module').then(m => m.NflCdsModule)
  },
  {
    path: 'football',
    loadChildren: () => import('./matches/foot-ball/foot-ball-cds.module').then(m => m.FootBallCdsModule)
  },
  {
    path: 'tennis',
    loadChildren: () => import('./matches/tennis/tennis-cds.module').then(m => m.TennisCdsModule)
  },
  {
    path: 'snooker',
    loadChildren: () => import('./matches/snooker-cds/snooker-cds.module').then(m => m.SnookerCdsModule)
  },
  {
    path: 'boxing',
    loadChildren: () => import('./matches/boxing-cds/boxing-cds.module').then(m => m.BoxingCdsModule)
  },
  {
    path: 'tennis-multi-match-coupon',
    loadChildren: () => import('./matches/tennis/components/multi-match-coupon/multi-match-coupon.module').then(m => m.MultiMatchCouponModule)
  },
  {
    path: 'rugby',
    loadChildren: () => import('./matches/rugby-cds/rugby-cds.module').then(m => m.RugbyCdsModule)
  },
  {
    path: 'dart',
    loadChildren: () => import('./matches/dart-cds/dart-cds.module').then(m => m.DartCdsModule)
  },
  {
    path: 'golf',
    loadChildren: () => import('./matches/golf-cds/golf-cds.module').then(m => m.GolfCdsModule)
  },
  {
    path: 'formula1',
    loadChildren: () => import('./matches/formula1-cds/formula1-cds.module').then(m => m.Formula1CdsModule)
  },
  {
    path: 'tv1',
    loadChildren: () => import('./outright/tv1/tv1.module').then(m => m.Tv1Module)
  },
  {
    path: 'tv2',
    loadChildren: () => import('./outright/tv2/tv2.module').then(m => m.Tv2Module)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CdsRoutingModule { }
