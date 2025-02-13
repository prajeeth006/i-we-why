import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { RaceStagePipe } from '../common/pipes/race-stage.pipe';
import { ErrorHandlerService } from '../error-handler.service';
import { DarkThemeHorseAntePostComponent } from './dark-theme/components/dark-theme-horse-ante-post/dark-theme-horse-ante-post/dark-theme-horse-ante-post.component';
import { DarkThemeHorseMeetingResultsComponent } from './dark-theme/components/dark-theme-horse-meeting-results/dark-theme-horse-meeting-results.component';
import { DarkThemeHorseRacingComponent } from './dark-theme/components/dark-theme-horse-racing/dark-theme-horse-racing.component';
import { DarkThemeRunnersComponent } from './dark-theme/components/dark-theme-horse-racing/dark-theme-runners/dark-theme-runners.component';
import { DarkThemeManualEachWayComponent } from './dark-theme/components/dark-theme-manual-horse-racing-template/dark-theme-manual-each-way/dark-theme-manual-each-way.component';
import { DarkThemeManualHorseRacingTemplateComponent } from './dark-theme/components/dark-theme-manual-horse-racing-template/dark-theme-manual-horse-racing-template.component';
import { DarkThemeManualRaceStageComponent } from './dark-theme/components/dark-theme-manual-horse-racing-template/dark-theme-manual-race-stage/dark-theme-manual-race-stage.component';
import { DarkThemeManualResultComponent } from './dark-theme/components/dark-theme-manual-horse-racing-template/dark-theme-manual-result/dark-theme-manual-result.component';
import { DarkThemeManualRunnersComponent } from './dark-theme/components/dark-theme-manual-horse-racing-template/dark-theme-manual-runners/dark-theme-manual-runners.component';
import { DarkThemeNonRunnersComponent } from './dark-theme/components/dark-theme-non-runners/dark-theme-non-runners.component';
import { HorseRacingCommonModule } from './horse-racing-common.module';
import { HorseRacingRoutingModule } from './horse-racing-routing.module';
import { DarkThemeManualMarketPricePipe } from './pipes/dark-theme-manual-market-price';
import { ManualMarketPricePipe } from './pipes/manual-market-price.pipe';
import { MarketPriceTransformPipe } from './pipes/market-price-transform.pipe';
import { NcastTypePipe } from './pipes/ncast-type.pipe';

@NgModule({
    declarations: [
        MarketPriceTransformPipe,
        NcastTypePipe,
        ManualMarketPricePipe,
        DarkThemeHorseRacingComponent,
        DarkThemeRunnersComponent,
        DarkThemeHorseAntePostComponent,
        DarkThemeManualRunnersComponent,
        DarkThemeManualResultComponent,
        DarkThemeManualEachWayComponent,
        DarkThemeManualRaceStageComponent,
        DarkThemeManualHorseRacingTemplateComponent,
        DarkThemeHorseMeetingResultsComponent,
        DarkThemeManualMarketPricePipe,
        DarkThemeNonRunnersComponent,
    ],
    imports: [CommonModule, GantryCommonModule, HorseRacingCommonModule, HorseRacingRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }, RaceStagePipe],
})
export class HorseRacingModule {}
