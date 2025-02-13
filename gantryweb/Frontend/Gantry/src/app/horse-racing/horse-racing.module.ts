import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EachWayComponent } from './components/horse-racing-template/each-way/each-way.component';
import { RunnersComponent } from './components/horse-racing-template/runners/runners.component';
import { ResultComponent } from './components/horse-racing-template/result/result.component';
import { MarketPriceTransformPipe } from './pipes/market-price-transform.pipe';
import { NcastTypePipe } from './pipes/ncast-type.pipe';
import { HorseRacingTemplateComponent } from './components/horse-racing-template/horse-racing-template.component';
import { MarketNamePipe } from './pipes/market-name.pipe';
import { RunnerCountPipe } from './pipes/runner-count.pipe';
import { GantryCommonModule } from '../common/gantry-common.module';
import { HorseRacingRoutingModule } from './horse-racing-routing.module';
import { ErrorHandlerService } from '../error-handler.service';
import { ManualHorseRacingTemplateComponent } from './components/manual-horse-racing-template/manual-horse-racing-template.component';
import { ManualResultComponent } from './components/manual-horse-racing-template/manual-result/manual-result.component';
import { ManualRunnersComponent } from './components/manual-horse-racing-template/manual-runners/manual-runners.component';
import { ManualMarketPricePipe } from './pipes/manual-market-price.pipe';
import { DarkThemeHorseRacingComponent } from './components/dark-theme-horse-racing/dark-theme-horse-racing.component';
import { DarkThemeRunnersComponent } from './components/dark-theme-horse-racing/dark-theme-runners/dark-theme-runners.component';
import { DarkThemeResultComponent } from './components/dark-theme-horse-racing/dark-theme-result/dark-theme-result.component';
import { DarkThemeEachWayComponent } from './components/dark-theme-horse-racing/dark-theme-each-way/dark-theme-each-way.component';
import { HorseRacingNavigatorComponent } from './components/horse-racing-navigator/horse-racing-navigator.component';


@NgModule({
  declarations: [
    HorseRacingTemplateComponent,
    EachWayComponent,
    MarketPriceTransformPipe,
    ResultComponent,
    RunnersComponent,
    NcastTypePipe,
    MarketNamePipe,
    RunnerCountPipe,
    ManualHorseRacingTemplateComponent,
    ManualResultComponent,
    ManualRunnersComponent,
    ManualMarketPricePipe,
    DarkThemeHorseRacingComponent,
    DarkThemeRunnersComponent,
    DarkThemeResultComponent,
    DarkThemeEachWayComponent,
    HorseRacingNavigatorComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HorseRacingRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class HorseRacingModule { }
