import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeBoxingCdsComponent } from '../../dark-theme-matches/dark-theme-boxing/dark-theme-boxing-cds.component';
import { DarkThemeIndividualRoundBettingComponent } from '../../dark-theme-matches/dark-theme-boxing/markets/dark-theme-individual-round-betting/dark-theme-individual-round-betting.component';
import { DarkThemeMatchBettingComponent } from '../../dark-theme-matches/dark-theme-boxing/markets/dark-theme-match-betting/dark-theme-match-betting.component';
import { DarkThemeMethodOfVictoryComponent } from '../../dark-theme-matches/dark-theme-boxing/markets/dark-theme-method-of-victory/dark-theme-method-of-victory.component';
import { DarkThemeWinningRoundsComponent } from '../../dark-theme-matches/dark-theme-boxing/markets/dark-theme-winning-rounds/dark-theme-winning-rounds.component';
import { BoxingCdsRoutingModule } from './boxing-cds-routing.module';

@NgModule({
    declarations: [
        DarkThemeBoxingCdsComponent,
        DarkThemeMatchBettingComponent,
        DarkThemeWinningRoundsComponent,
        DarkThemeMethodOfVictoryComponent,
        DarkThemeIndividualRoundBettingComponent,
    ],
    imports: [CommonModule, GantryCommonModule, BoxingCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class BoxingCdsModule {}
