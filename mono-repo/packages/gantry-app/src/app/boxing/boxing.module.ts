import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { ErrorHandlerService } from '../error-handler.service';
import { BoxingRoutingModule } from './boxing-routing.module';
import { BoxingTemplateComponent } from './components/boxing-template/boxing-template.component';
import { FightBettingComponent } from './components/markets/fight-betting/fight-betting.component';
import { MethodOfVictoryComponent } from './components/markets/method-of-victory/method-of-victory.component';
import { RoundBettingComponent } from './components/markets/round-betting/round-betting.component';
import { WinningRoundGroupComponent } from './components/markets/winning-round-group/winning-round-group.component';

@NgModule({
    declarations: [BoxingTemplateComponent, FightBettingComponent, RoundBettingComponent, WinningRoundGroupComponent, MethodOfVictoryComponent],
    imports: [CommonModule, GantryCommonModule, BoxingRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class BoxingModule {}
