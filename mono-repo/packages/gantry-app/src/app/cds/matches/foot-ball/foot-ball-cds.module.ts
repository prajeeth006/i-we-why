import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeFootBallCdsTemplateComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/dark-theme-foot-ball-cds-template.component';
import { DarkThemeBothTeamsToScoreComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/markets/dark-theme-both-teams-to-score/dark-theme-both-teams-to-score.component';
import { DarkThemeCorrectScoreComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/markets/dark-theme-correct-score/dark-theme-correct-score.component';
import { DarkThemeFirstGoalScorerComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/markets/dark-theme-first-goal-scorer/dark-theme-first-goal-scorer.component';
import { DarkThemeMatchResultsBothComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/markets/dark-theme-match-results-both/dark-theme-match-results-both.component';
import { DarkThemeMatchResultsComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/markets/dark-theme-match-results/dark-theme-match-results.component';
import { DarkThemeTotalGoalsComponent } from '../../dark-theme-matches/dark-theme-foot-ball-cds-template/markets/dark-theme-total-goals/dark-theme-total-goals.component';
import { DarkThemeHomeDrawAwayComponent } from '../../dark-theme-matches/dark-theme-football/dark-theme-home-draw-away/dark-theme-home-draw-away.component';
import { FootBallCdsRoutingModule } from './foot-ball-cds-routing.module';

@NgModule({
    declarations: [
        DarkThemeFootBallCdsTemplateComponent,
        DarkThemeBothTeamsToScoreComponent,
        DarkThemeTotalGoalsComponent,
        DarkThemeMatchResultsBothComponent,
        DarkThemeMatchResultsComponent,
        DarkThemeFirstGoalScorerComponent,
        DarkThemeCorrectScoreComponent,
        DarkThemeHomeDrawAwayComponent,
    ],
    imports: [CommonModule, GantryCommonModule, FootBallCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class FootBallCdsModule {}
