import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RugbyCdsRoutingModule } from './rugby-cds-routing.module';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';
import { MatchBettingComponent } from './components/markets/match-betting/match-betting.component';
import { MatchHandicapComponent } from './components/markets/match-handicap/match-handicap.component';
import { RubyCdsComponent } from './components/rugby-cds.component';
import { TotalPointsComponent } from './components/markets/total-points/total-points.component';
import { FirsthalfHandicapComponent } from './components/markets/firsthalf-handicap/firsthalf-handicap.component';
import { HalftimeFulltimeComponent } from './components/markets/halftime-fulltime/halftime-fulltime.component';

@NgModule({
  declarations: [
    RubyCdsComponent,
    MatchBettingComponent,
    MatchHandicapComponent,
    TotalPointsComponent,
    FirsthalfHandicapComponent,
    HalftimeFulltimeComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    RugbyCdsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class RugbyCdsModule { }
