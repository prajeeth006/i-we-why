import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { DarkThemeDartCdsComponent } from '../../dark-theme-matches/dark-theme-dart-cds/components/dark-theme-dart-cds.component';
import { DarkThemeCorrectScoreComponent } from '../../dark-theme-matches/dark-theme-dart-cds/components/markets/dark-theme-correct-score/dark-theme-correct-score.component';
import { DarkThemeMatchBettingComponent } from '../../dark-theme-matches/dark-theme-dart-cds/components/markets/dark-theme-match-betting/dark-theme-match-betting.component';
import { DarkThemeMatchHanicapComponent } from '../../dark-theme-matches/dark-theme-dart-cds/components/markets/dark-theme-matchHanicap/dark-theme-match-hanicap.component';
import { DarkThemeTotal180sComponent } from '../../dark-theme-matches/dark-theme-dart-cds/components/markets/dark-theme-total180s/dark-theme-total180s.component';
import { DartCdsRoutingModule } from './dart-cds-routing.module';

@NgModule({
    declarations: [
        DarkThemeDartCdsComponent,
        DarkThemeMatchBettingComponent,
        DarkThemeTotal180sComponent,
        DarkThemeMatchHanicapComponent,
        DarkThemeCorrectScoreComponent,
    ],
    imports: [CommonModule, GantryCommonModule, DartCdsRoutingModule],
})
export class DartCdsModule {}
