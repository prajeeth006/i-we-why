import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { MatchBetsComponent } from './match-bets.component';
import { MatchBetsRoutingModule } from './match-bets-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    MatchBetsComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    MatchBetsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class MatchBetsModule { }
