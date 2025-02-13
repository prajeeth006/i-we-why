import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeTennisCdsComponent } from '../../dark-theme-matches/dark-theme-tennis/dark-theme-tennis-cds.component';
import { DarkThemeMatchBettingComponent } from '../../dark-theme-matches/dark-theme-tennis/markets/match-betting/dark-theme-match-betting.component';
import { DarkThemeSetBettingComponent } from '../../dark-theme-matches/dark-theme-tennis/markets/set-betting/dark-theme-set-betting.component';
import { TennisCdsRoutingModule } from './tennis-cds-routing.module';

@NgModule({
    declarations: [DarkThemeTennisCdsComponent, DarkThemeMatchBettingComponent, DarkThemeSetBettingComponent],
    imports: [CommonModule, GantryCommonModule, TennisCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class TennisCdsModule {}
