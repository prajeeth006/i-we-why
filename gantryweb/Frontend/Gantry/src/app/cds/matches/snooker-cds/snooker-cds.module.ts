import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnookerCdsRoutingModule } from './snooker-cds-routing.module';
import { SnookerCdsComponent } from './components/snooker-cds.component';
import { MatchBettingComponent } from './components/markets/match-betting/match-betting.component';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { TotalframesBettingComponent } from './components/markets/totalframes-betting/totalframes-betting.component';
import { MatchHanicapComponent } from './components/markets/matchHanicap/match-hanicap.component';
import { FrameBettingComponent } from './components/markets/frame-betting/frame-betting.component';


@NgModule({
  declarations: [
    SnookerCdsComponent,
    MatchBettingComponent,
    TotalframesBettingComponent,
    MatchHanicapComponent,
    FrameBettingComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    SnookerCdsRoutingModule
  ]
})
export class SnookerCdsModule { }
