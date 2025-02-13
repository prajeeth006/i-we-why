import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { DarkThemeCommonCorrectScoreComponent } from '../cds/dark-theme-matches/common/components/dark-theme-common-correct-scores/dark-theme-common-correct-scores.component';
import { DarkThemeCommonMarketComponent } from '../cds/dark-theme-matches/common/components/dark-theme-common-market-matches/dark-theme-common-market-matches.component';
import { DarkThemeCommonMarketRecordComponent } from '../cds/dark-theme-matches/common/components/dark-theme-common-market-records/dark-theme-common-market-records.component';
import { DarkThemeOutrightMarketComponent } from '../cds/dark-theme-outright/dark-theme-outright-market/dark-theme-outright-market.component';
import { OutrightMarketComponent } from '../cds/outright/common/outright-market/outright-market.component';
import { ErrorHandlerService } from '../error-handler.service';
import { RacingDistanceTransform } from '../greyhound-racing/pipes/racing-distance.pipe';
import { DividendsVScrollDirective } from '../horse-racing/dividends-v-scroll.directive';
import { MarketNamePipe } from '../horse-racing/pipes/market-name.pipe';
import { NonRunnerListPipe } from '../horse-racing/pipes/non-runner-list.pipe';
import { AntePostCommonComponent } from './components/ante-post-common/ante-post-common.component';
import { BannerComponent } from './components/banner/banner.component';
import { BasePageComponent } from './components/base-page/base-page.component';
import { DarkThemeAntePostComponent } from './components/dark-theme-ante-post/dark-theme-ante-post.component';
import { DarkThemeBasePageComponent } from './components/dark-theme-base-page/dark-theme-base-page.component';
import { DarkThemeFillerPageComponent } from './components/dark-theme-filler-page/dark-theme-filler-page.component';
import { DarkThemeFooterFullComponent } from './components/dark-theme-footer-full/dark-theme-footer-full.component';
import { DarkThemeFooterComponent } from './components/dark-theme-footer/dark-theme-footer.component';
import { DarkThemeHeaderFullComponent } from './components/dark-theme-header-full/dark-theme-header-full.component';
import { DarkThemeHeaderComponent } from './components/dark-theme-header/dark-theme-header.component';
import { DarkThemeManualOutrightComponent } from './components/dark-theme-manual-outright/dark-theme-manual-outright/dark-theme-manual-outright.component';
import { ErrorComponent } from './components/error/error.component';
import { FillerPageComponent } from './components/filler-page/filler-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { ManualOutrightComponent } from './components/manual-outright/manual-outright/manual-outright.component';
import { MultimarketHomeAwayComponent } from './components/multimarket-home-away/multimarket-home-away.component';
import { MultimarketHomeSelectionAwayComponent } from './components/multimarket-home-selection-away/multimarket-home-selection-away.component';
import { MultimarketMatchBettingComponent } from './components/multimarket-match-betting/multimarket-match-betting.component';
import { AutoAdjustFontDirective } from './directive/auto-adjust-font.directive';
import { RetrySrcDirective } from './directive/retry-src.directive';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
import { DarkThemeEventDatetimePipe } from './pipes/dark-theme-event-datetime.pipe';
import { EventDatetimeChangeformatPipe } from './pipes/event-datetime.changeformat.pipe';
import { EventDatetimePipe } from './pipes/event-datetime.pipe';
import { FixedDecimalPipe } from './pipes/fixed-decimal.pipe';
import { HideEntryPipe } from './pipes/hide-entry.pipe';
import { MarketPriceTransformPipe } from './pipes/market-price-transform.pipe';
import { PrepareEvsPipe } from './pipes/prepare-evs.pipe';
import { RaceStagePipe } from './pipes/race-stage.pipe';
import { RunnerCountPipe } from './pipes/runner-count.pipe';
import { RunnerPositionSuffixPipe } from './pipes/runner-position-suffix.pipe';
import { TrimSelectionNamePipe } from './pipes/selection-name.pipe';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { SportEventDateFormatPipe } from './pipes/sport-event-datetime-format.pipe';
import { TitleCaseExceptPipePipe } from './pipes/title-case-except-pipe.pipe';
import { TruncateAndFormatPipe } from './pipes/truncate-and-format.pipe';

@NgModule({
    declarations: [
        BannerComponent,
        FooterComponent,
        BasePageComponent,
        ErrorComponent,
        RaceStagePipe,
        RunnerPositionSuffixPipe,
        SportEventDateFormatPipe,
        MarketPriceTransformPipe,
        FillerPageComponent,
        DarkThemeFillerPageComponent,
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
        DarkThemeBasePageComponent,
        DarkThemeHeaderComponent,
        DarkThemeFooterComponent,
        MarketNamePipe,
        NonRunnerListPipe,
        DarkThemeHeaderFullComponent,
        DividendsVScrollDirective,
        CapitalizeFirstPipe,
        TitleCaseExceptPipePipe,
        TruncateAndFormatPipe,
        DarkThemeFooterFullComponent,
        SentenceCasePipe,
        DarkThemeAntePostComponent,
        DarkThemeOutrightMarketComponent,
        DarkThemeEventDatetimePipe,
        DarkThemeCommonMarketComponent,
        DarkThemeCommonMarketRecordComponent,
        DarkThemeCommonCorrectScoreComponent,
        RacingDistanceTransform,
        DarkThemeManualOutrightComponent,
        AutoAdjustFontDirective,
        AntePostCommonComponent,
        RunnerCountPipe,
    ],
    imports: [CommonModule],
    exports: [
        BannerComponent,
        FooterComponent,
        BasePageComponent,
        ErrorComponent,
        RaceStagePipe,
        RunnerPositionSuffixPipe,
        SportEventDateFormatPipe,
        MarketPriceTransformPipe,
        HideEntryPipe,
        FillerPageComponent,
        DarkThemeFillerPageComponent,
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
        DarkThemeBasePageComponent,
        DarkThemeHeaderComponent,
        DarkThemeFooterComponent,
        MarketNamePipe,
        NonRunnerListPipe,
        DarkThemeHeaderFullComponent,
        DividendsVScrollDirective,
        CapitalizeFirstPipe,
        TitleCaseExceptPipePipe,
        TruncateAndFormatPipe,
        DarkThemeFooterFullComponent,
        SentenceCasePipe,
        DarkThemeAntePostComponent,
        DarkThemeOutrightMarketComponent,
        DarkThemeEventDatetimePipe,
        DarkThemeCommonMarketComponent,
        DarkThemeCommonMarketRecordComponent,
        DarkThemeCommonCorrectScoreComponent,
        RacingDistanceTransform,
        DarkThemeManualOutrightComponent,
        AutoAdjustFontDirective,
        AntePostCommonComponent,
        RunnerCountPipe,
    ],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class GantryCommonModule {}
