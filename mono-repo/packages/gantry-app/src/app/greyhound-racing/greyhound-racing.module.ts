import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { RaceStagePipe } from '../common/pipes/race-stage.pipe';
import { ErrorHandlerService } from '../error-handler.service';
import { GreyhoundEachWayComponent } from './components/greyhound-racing-template/each-way/each-way.component';
import { GreyhoundResultComponent } from './components/greyhound-racing-template/result/result.component';
import { GreyhoundRunnersComponent } from './components/greyhound-racing-template/runners/runners.component';
import { ManualResultsComponent } from './components/manual-greyhound-racing-template/manual-results/manual-results.component';
import { ManualRunnersComponent } from './components/manual-greyhound-racing-template/manual-runners/manual-runners/manual-runners.component';
import { DarkThemeGreyhoundAntePostComponent } from './dark-theme/components/dark-theme-greyhound-ante-post/dark-theme-greyhound-ante-post/dark-theme-greyhound-ante-post.component';
import { DarkThemeEachWayComponent } from './dark-theme/components/dark-theme-greyhound-racing-template/dark-theme-each-way/dark-theme-each-way.component';
import { DarkThemeGreyhoundRacingTemplateComponent } from './dark-theme/components/dark-theme-greyhound-racing-template/dark-theme-greyhound-racing-template.component';
import { DarkThemeRaceStageComponent } from './dark-theme/components/dark-theme-greyhound-racing-template/dark-theme-race-stage/dark-theme-race-stage.component';
import { DarkThemeResultComponent } from './dark-theme/components/dark-theme-greyhound-racing-template/dark-theme-result/dark-theme-result.component';
import { DarkThemeRunnersComponent } from './dark-theme/components/dark-theme-greyhound-racing-template/dark-theme-runners/dark-theme-runners.component';
import { DarkThemeGreyhoundsMeetingResultsComponent } from './dark-theme/components/dark-theme-greyhounds-meeting-results/dark-theme-greyhounds-meeting-results.component';
import { DarkThemeManualGreyhoundRacingTemplateComponent } from './dark-theme/components/dark-theme-manual-greyhound-racing-template/dark-theme-manual-greyhound-racing-template.component';
import { DarkThemeManualResultsComponent } from './dark-theme/components/dark-theme-manual-greyhound-racing-template/dark-theme-manual-results/dark-theme-manual-results.component';
import { DarkThemeManualRunnersComponent } from './dark-theme/components/dark-theme-manual-greyhound-racing-template/dark-theme-manual-runners/dark-theme-manual-runners.component';
import { GreyhoundRacingRoutingModule } from './greyhound-racing-routing.module';
import { DarkThemeManualMarketPricePipe } from './pipes/dark-theme-manual-market-price.pipe';
import { ManualMarketPricePipe } from './pipes/manual-market-price.pipe';
import { MarketPriceTransformPipe } from './pipes/market-price-transform.pipe';
import { NcastTransformPipe } from './pipes/ncast-transform';
import { RacingPostTipPipe } from './pipes/racing-post-tip.pipe';
import { VacantCheckTransformPipe } from './pipes/vacant-check-transform.pipe';

@NgModule({
    declarations: [
        GreyhoundResultComponent,
        GreyhoundRunnersComponent,
        GreyhoundEachWayComponent,
        VacantCheckTransformPipe,
        NcastTransformPipe,
        MarketPriceTransformPipe,
        ManualRunnersComponent,
        ManualResultsComponent,
        ManualMarketPricePipe,
        DarkThemeGreyhoundRacingTemplateComponent,
        DarkThemeRunnersComponent,
        DarkThemeResultComponent,
        DarkThemeEachWayComponent,
        DarkThemeRaceStageComponent,
        RacingPostTipPipe,
        DarkThemeGreyhoundsMeetingResultsComponent,
        DarkThemeGreyhoundAntePostComponent,
        DarkThemeManualGreyhoundRacingTemplateComponent,
        DarkThemeManualRunnersComponent,
        DarkThemeManualResultsComponent,
        DarkThemeManualMarketPricePipe,
    ],
    imports: [CommonModule, GantryCommonModule, GreyhoundRacingRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }, VacantCheckTransformPipe, RaceStagePipe],
})
export class GreyhoundRacingModule {}
