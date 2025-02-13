import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeRubyCdsComponent } from '../../dark-theme-matches/dark-theme-rugby-cds/components/dark-theme-rugby-cds.component';
import { DarkThemeHalftimeFulltimeComponent } from '../../dark-theme-matches/dark-theme-rugby-cds/components/markets/dark-theme-halftime-fulltime/dark-theme-halftime-fulltime.component';
import { DarkThemeMatchBettingComponent } from '../../dark-theme-matches/dark-theme-rugby-cds/components/markets/dark-theme-match-betting/dark-theme-match-betting.component';
import { DarkThemeMatchHandicapComponent } from '../../dark-theme-matches/dark-theme-rugby-cds/components/markets/dark-theme-match-handicap/dark-theme-match-handicap.component';
import { DarkThemeTotalPointsComponent } from '../../dark-theme-matches/dark-theme-rugby-cds/components/markets/dark-theme-total-points/dark-theme-total-points.component';
import { RugbyCdsRoutingModule } from './rugby-cds-routing.module';

@NgModule({
    declarations: [
        DarkThemeRubyCdsComponent,
        DarkThemeMatchBettingComponent,
        DarkThemeMatchHandicapComponent,
        DarkThemeTotalPointsComponent,
        DarkThemeHalftimeFulltimeComponent,
    ],
    imports: [CommonModule, GantryCommonModule, RugbyCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class RugbyCdsModule {}
