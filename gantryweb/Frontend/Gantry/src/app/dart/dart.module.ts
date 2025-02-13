import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { DartTemplateComponent } from './components/dart-template/dart-template.component';
import { DartRoutingModule } from './dart-routing.module';
import { MatchBettingComponent } from './components/markets/match-betting/match-betting.component';
import { CorrectScoreComponent } from './components/markets/correct-score/correct-score.component';
import { MatchOneOnOneComponent } from './components/markets/match-one-on-one/match-one-on-one.component';
import { ErrorHandlerService } from '../error-handler.service';




@NgModule({
  declarations: [
    DartTemplateComponent,
    MatchBettingComponent,
    CorrectScoreComponent,
    MatchOneOnOneComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    DartRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class DartModule { }
