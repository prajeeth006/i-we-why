import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../common/gantry-common.module';
import { CricketTemplateComponent } from './components/cricket-template.component';
import { CricketRoutingModule } from './cricket-routing.module';
import { MatchBettingComponent } from './components/markets/match-betting/match-betting.component';
import { TopRunscorerComponent } from './components/markets/top-runscorer/top-runscorer.component';
import { TopFirstInningRunscorerComponent } from './components/markets/top-first-inning-runscorer/top-first-inning-runscorer.component';
import { TotalSixesComponent } from './components/markets/total-sixes/total-sixes.component';
import { TowinTheTossComponent } from './components/markets/towin-the-toss/towin-the-toss.component';
import { ToscoreInfirststInnsComponent } from './components/markets/toscore-infirstst-inns/toscore-infirstst-inns.component';
import { ErrorHandlerService } from '../error-handler.service';

@NgModule({
  declarations: [
    CricketTemplateComponent,
    MatchBettingComponent,
    TopRunscorerComponent,
    TopFirstInningRunscorerComponent,
    TotalSixesComponent,
    TowinTheTossComponent,
    ToscoreInfirststInnsComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    CricketRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class CricketModule { }
