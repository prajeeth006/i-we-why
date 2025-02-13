import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeCricketCdsComponent } from '../../dark-theme-matches/dark-theme-cricket-cds/components/dark-theme-cricket-cds.component';
import { DarkThemeMatchBettingComponent } from '../../dark-theme-matches/dark-theme-cricket-cds/components/markets/dark-theme-match-betting/dark-theme-match-betting.component';
import { DarkThemeTopRunscorerComponent } from '../../dark-theme-matches/dark-theme-cricket-cds/components/markets/dark-theme-top-runscorer/dark-theme-top-runscorer.component';
import { DarkThemeToscoreInfirststInnsComponent } from '../../dark-theme-matches/dark-theme-cricket-cds/components/markets/dark-theme-toscore-infirstst-inns/dark-theme-toscore-infirstst-inns.component';
import { DarkThemeTotalSixesComponent } from '../../dark-theme-matches/dark-theme-cricket-cds/components/markets/dark-theme-total-sixes/dark-theme-total-sixes.component';
import { CricketCdsRoutingModule } from './cricket-cds-routing.module';

@NgModule({
    declarations: [
        DarkThemeCricketCdsComponent,
        DarkThemeMatchBettingComponent,
        DarkThemeTopRunscorerComponent,
        DarkThemeTotalSixesComponent,
        DarkThemeToscoreInfirststInnsComponent,
    ],
    imports: [CommonModule, GantryCommonModule, CricketCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class CricketCdsModule {}
