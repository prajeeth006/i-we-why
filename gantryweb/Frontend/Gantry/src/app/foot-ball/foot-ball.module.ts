import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GantryCommonModule } from "../common/gantry-common.module";
import { FootBallRoutingModule } from './foot-ball-routing.module';
import { FootBallTemplateComponent } from './components/foot-ball-template/foot-ball-template.component';
import { MatchResultComponent } from './components/markets/football/match-result/match-result.component';
import { FirstGoalscorerComponent } from './components/markets/football/first-goalscorer/first-goalscorer.component';
import { CorrectScoreComponent } from './components/markets/football/correct-score/correct-score.component';
import { HalftimeFulltimeComponent } from './components/markets/football/halftime-fulltime/halftime-fulltime.component';
import { MoneyLineComponent } from './components/markets/nfl/money-line/money-line.component';
import { HandicapBettingComponent } from './components/markets/nfl/handicap-betting/handicap-betting.component';
import { WinningMarginComponent } from './components/markets/nfl/winning-margin/winning-margin.component';
import { FirstTouchdownScorerComponent } from './components/markets/nfl/first-touchdown-scorer/first-touchdown-scorer.component';
import { BothteamstoScoreComponent } from './components/markets/football/bothteamsto-score/bothteamsto-score.component';
import { TotalgoalsinthematchComponent } from './components/markets/football/totalgoalsinthematch/totalgoalsinthematch.component';
import { MatchresultBothteamstoscoreComponent } from './components/markets/football/matchresult-bothteamstoscore/matchresult-bothteamstoscore.component';
import { ErrorHandlerService } from '../error-handler.service';



@NgModule({
  declarations: [
    FootBallTemplateComponent,
    MatchResultComponent,
    FirstGoalscorerComponent,
    CorrectScoreComponent,
    HalftimeFulltimeComponent,
    MoneyLineComponent,
    HandicapBettingComponent,
    WinningMarginComponent,
    FirstTouchdownScorerComponent,
    BothteamstoScoreComponent,
    TotalgoalsinthematchComponent,
    MatchresultBothteamstoscoreComponent,
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    FootBallRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]

})
export class FootBallModule { }
