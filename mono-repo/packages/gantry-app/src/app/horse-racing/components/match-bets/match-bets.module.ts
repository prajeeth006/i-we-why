import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeMatchBetsComponent } from '../../dark-theme/components/dark-theme-match-bets/dark-theme-match-bets.component';
import { MatchBetsRoutingModule } from './match-bets-routing.module';

@NgModule({
    declarations: [DarkThemeMatchBetsComponent],
    imports: [CommonModule, GantryCommonModule, MatchBetsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class MatchBetsModule {}
