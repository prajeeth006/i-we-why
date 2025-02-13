import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { DarkThemeSnookerCdsComponent } from '../../dark-theme-matches/dark-theme-snooker-cds/components/dark-theme-snooker-cds.component';
import { DarkThemeFrameBettingComponent } from '../../dark-theme-matches/dark-theme-snooker-cds/components/markets/dark-theme-frame-betting/dark-theme-frame-betting.component';
import { DarkThemeMatchBettingComponent } from '../../dark-theme-matches/dark-theme-snooker-cds/components/markets/dark-theme-match-betting/dark-theme-match-betting.component';
import { DarkThemeMatchHandicapComponent } from '../../dark-theme-matches/dark-theme-snooker-cds/components/markets/dark-theme-matchHandicap/dark-theme-match-handicap.component';
import { DarkThemeTotalframesBettingComponent } from '../../dark-theme-matches/dark-theme-snooker-cds/components/markets/dark-theme-totalframes-betting/dark-theme-totalframes-betting.component';
import { SnookerCdsRoutingModule } from './snooker-cds-routing.module';

@NgModule({
    declarations: [
        DarkThemeSnookerCdsComponent,
        DarkThemeMatchBettingComponent,
        DarkThemeTotalframesBettingComponent,
        DarkThemeMatchHandicapComponent,
        DarkThemeFrameBettingComponent,
    ],
    imports: [CommonModule, GantryCommonModule, SnookerCdsRoutingModule],
})
export class SnookerCdsModule {}
