import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from "@angular/core";
import { GantryCommonModule } from "src/app/common/gantry-common.module";
import { ErrorHandlerService } from "src/app/error-handler.service";

import { HomeDrawAwayRoutingModule } from './foot-ball-cds-routing.module';
import { HomeDrawAwayComponent }  from '././home-draw-away/components/home-draw-away.component';
import { FootBallCdsTemplateComponent } from './foot-ball-cds-template/foot-ball-cds-template.component';
import { TotalgoalsinthematchComponent } from './foot-ball-cds-template/markets/totalgoalsinthematch/totalgoalsinthematch/totalgoalsinthematch.component'
import { BothteamtoscoreComponent } from './foot-ball-cds-template/markets/both-teams-to-score/bothteamtoscore/bothteamtoscore.component';
import { MatchResultsBothTeamsToScoreComponent } from './foot-ball-cds-template/markets/matchResultsBothTeamToScore/match-results-both-teams-to-score/match-results-both-teams-to-score.component';
import { MatchResultsComponent } from './foot-ball-cds-template/markets/match-results/match-results/match-results.component';
import { CorrectScoreComponent } from './foot-ball-cds-template/markets/correct-score/correct-score.component';
import { FirstGoalscorerComponent } from './foot-ball-cds-template/markets/first-goalscorer/first-goalscorer.component'


@NgModule({
  declarations: [
    HomeDrawAwayComponent,
    
    FootBallCdsTemplateComponent,
    TotalgoalsinthematchComponent,
    BothteamtoscoreComponent,
    MatchResultsBothTeamsToScoreComponent,
    MatchResultsComponent,
    CorrectScoreComponent,
    FirstGoalscorerComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HomeDrawAwayRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class FootBallCdsModule { }
