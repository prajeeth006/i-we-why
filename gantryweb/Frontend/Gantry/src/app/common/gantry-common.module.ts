import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorComponent } from './components/error/error.component';
import { BasePageComponent } from './components/base-page/base-page.component';
import { RaceStagePipe } from './pipes/race-stage.pipe';
import { AntePostLargeComponent } from './components/ante-post/ante-post-large/ante-post-large.component';
import { AntePostMediumComponent } from './components/ante-post/ante-post-medium/ante-post-medium.component';
import { AntePostSmallComponent } from './components/ante-post/ante-post-small/ante-post-small.component';
import { RunnerPositionSuffixPipe } from './pipes/runner-position-suffix.pipe';
import { SportEventDateFormatPipe } from './pipes/sport-event-datetime-format.pipe';
import { MarketPriceTransformPipe } from './pipes/market-price-transform.pipe';
import { AntePostPaginationComponent } from './components/ante-post/ante-post-pagination/ante-post-pagination.component';
import { FillerPageComponent } from './components/filler-page/filler-page.component';
import { EventDatetimePipe } from './pipes/event-datetime.pipe';
import { TrimSelectionNamePipe } from './pipes/selection-name.pipe';
import { EventDatetimeChangeformatPipe } from './pipes/event-datetime.changeformat.pipe';
import { MultimarketHomeAwayComponent } from './components/multimarket-home-away/multimarket-home-away.component';
import { MultimarketHomeSelectionAwayComponent } from './components/multimarket-home-selection-away/multimarket-home-selection-away.component';
import { MultimarketMatchBettingComponent } from './components/multimarket-match-betting/multimarket-match-betting.component';
import { FixedDecimalPipe } from './pipes/fixed-decimal.pipe';
import { HideEntryPipe } from './pipes/hide-entry.pipe';
import { RetrySrcDirective } from './directive/retry-src.directive';
import { ErrorHandlerService } from '../error-handler.service';
import { ManualOutrightComponent } from './components/manual-outright/manual-outright/manual-outright.component';
import { PrepareEvsPipe } from './pipes/prepare-evs.pipe';
import { OutrightMarketComponent } from '../cds/outright/common/outright-market/outright-market.component';
import { DarkThemeHeaderComponent } from './components/dark-theme-header/dark-theme-header.component';
import { DarkThemeFooterComponent } from './components/dark-theme-footer/dark-theme-footer.component';
import { DarkThemeBasePageComponent } from './components/dark-theme-base-page/dark-theme-base-page.component';

@NgModule({
  declarations: [
    BannerComponent,
    FooterComponent,
    BasePageComponent,
    ErrorComponent,
    RaceStagePipe,
    RunnerPositionSuffixPipe,
    AntePostLargeComponent,
    AntePostMediumComponent,
    AntePostSmallComponent,
    SportEventDateFormatPipe,
    MarketPriceTransformPipe,
    AntePostPaginationComponent,
    FillerPageComponent,
    EventDatetimePipe,
    TrimSelectionNamePipe,
    EventDatetimeChangeformatPipe,
    MultimarketHomeAwayComponent,
    MultimarketHomeSelectionAwayComponent,
    MultimarketMatchBettingComponent,
    FixedDecimalPipe,
    HideEntryPipe,
    RetrySrcDirective,
    ManualOutrightComponent,
    PrepareEvsPipe,
    OutrightMarketComponent,
    DarkThemeHeaderComponent,
    DarkThemeFooterComponent,
    DarkThemeBasePageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BannerComponent,
    FooterComponent,
    BasePageComponent,
    ErrorComponent,
    RaceStagePipe,
    RunnerPositionSuffixPipe,
    AntePostLargeComponent,
    AntePostMediumComponent,
    AntePostSmallComponent,
    SportEventDateFormatPipe,
    MarketPriceTransformPipe,
    HideEntryPipe,
    AntePostPaginationComponent,
    FillerPageComponent,
    EventDatetimePipe,
    TrimSelectionNamePipe,
    EventDatetimeChangeformatPipe,
    MultimarketHomeAwayComponent,
    MultimarketHomeSelectionAwayComponent,
    MultimarketMatchBettingComponent,
    FixedDecimalPipe,
    RetrySrcDirective,
    ManualOutrightComponent,
    PrepareEvsPipe,
    OutrightMarketComponent,
    DarkThemeBasePageComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class GantryCommonModule { }
