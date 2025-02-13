import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CricketCdsRoutingModule } from './cricket-cds-routing.module';
import { CricketCdsComponent } from './components/cricket-cds.component';
import { MatchBettingComponent } from './components/markets/match-betting/match-betting.component';
import { ErrorHandlerService } from 'src/app/error-handler.service';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { TopRunscorerComponent } from './components/markets/top-runscorer/top-runscorer.component';
import { TotalSixesComponent } from './components/markets/total-sixes/total-sixes.component';
import { ToscoreInfirststInnsComponent } from './components/markets/toscore-infirstst-inns/toscore-infirstst-inns.component';



@NgModule({
  declarations: [
    CricketCdsComponent,
    MatchBettingComponent,
    TopRunscorerComponent,
    TotalSixesComponent,
    ToscoreInfirststInnsComponent,
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    CricketCdsRoutingModule

  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class CricketCdsModule { }
