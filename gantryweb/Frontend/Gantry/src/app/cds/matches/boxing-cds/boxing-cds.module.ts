import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxingCdsRoutingModule } from './boxing-cds-routing.module';
import { BoxingCdsComponent } from './components/boxing-cds/boxing-cds.component';
import { FightResultComponent } from './components/markets/fight-result/fight-result.component';
import { MethodOfVictoryComponent } from './components/markets/method-of-victory/method-of-victory.component';
import { RoundGroupBettingComponent } from './components/markets/round-group-betting/round-group-betting.component';
import { IndividualRoundBettingComponent } from './components/markets/individual-round-betting/individual-round-betting.component';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    BoxingCdsComponent,
    FightResultComponent,
    MethodOfVictoryComponent,
    RoundGroupBettingComponent,
    IndividualRoundBettingComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    BoxingCdsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class BoxingCdsModule { }
