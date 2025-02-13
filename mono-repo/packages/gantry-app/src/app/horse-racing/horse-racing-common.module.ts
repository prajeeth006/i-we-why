import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { ErrorHandlerService } from '../error-handler.service';
import { DarkThemeEachWayComponent } from './dark-theme/components/dark-theme-horse-racing/dark-theme-each-way/dark-theme-each-way.component';
import { DarkThemeRaceStageComponent } from './dark-theme/components/dark-theme-horse-racing/dark-theme-race-stage/dark-theme-race-stage.component';
import { DarkThemeResultComponent } from './dark-theme/components/dark-theme-horse-racing/dark-theme-result/dark-theme-result.component';
import { DividendsSeparatorDirective } from './dividends-separator.directive';
import { DarkThemeMarketPriceTransformPipe } from './pipes/dark-theme-market-price-transform.pipe';

@NgModule({
    declarations: [
        DividendsSeparatorDirective,
        DarkThemeEachWayComponent,
        DarkThemeRaceStageComponent,
        DarkThemeMarketPriceTransformPipe,
        DarkThemeResultComponent,
    ],
    imports: [CommonModule, GantryCommonModule],
    exports: [
        DividendsSeparatorDirective,
        DarkThemeEachWayComponent,
        DarkThemeRaceStageComponent,
        DarkThemeMarketPriceTransformPipe,
        DarkThemeResultComponent,
    ],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class HorseRacingCommonModule {}
