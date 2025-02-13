import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreyhoundRacingTemplateComponent } from './components/greyhound-racing-template/greyhound-racing-template.component';
import { GreyhoundResultComponent } from './components/greyhound-racing-template/result/result.component';
import { GreyhoundRunnersComponent } from './components/greyhound-racing-template/runners/runners.component';
import { GreyhoundEachWayComponent } from './components/greyhound-racing-template/each-way/each-way.component';
import { GantryCommonModule } from '../common/gantry-common.module';
import { VacantCheckTransformPipe } from './pipes/vacant-check-transform.pipe';
import { NcastTransformPipe } from './pipes/ncast-transform';
import { RunnerCountPipe } from './pipes/runner-count.pipe';
import { RacingDistanceTransform } from './pipes/racing-distance.pipe';
import { GreyhoundRacingRoutingModule } from './greyhound-racing-routing.module';
import { TrapChallengeComponent } from './components/trap-challenge/trap-challenge.component';
import { MarketPriceTransformPipe } from './pipes/market-price-transform.pipe';
import { ErrorHandlerService } from '../error-handler.service';
import { ManualRunnersComponent } from './components/manual-greyhound-racing-template/manual-runners/manual-runners/manual-runners.component';
import { ManualGreyhoundRacingTemplateComponent } from './components/manual-greyhound-racing-template/manual-greyhound-racing-template.component';
import { ManualResultsComponent } from './components/manual-greyhound-racing-template/manual-results/manual-results.component';
import { ManualMarketPricePipe } from './pipes/manual-market-price.pipe';

@NgModule({
  declarations: [
    GreyhoundRacingTemplateComponent,
    GreyhoundResultComponent,
    GreyhoundRunnersComponent,
    GreyhoundEachWayComponent,
    VacantCheckTransformPipe,
    NcastTransformPipe,
    RunnerCountPipe,
    RacingDistanceTransform,
    TrapChallengeComponent,
    MarketPriceTransformPipe,
    ManualRunnersComponent,
    ManualGreyhoundRacingTemplateComponent,
    ManualResultsComponent,
    ManualMarketPricePipe
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    GreyhoundRacingRoutingModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class GreyhoundRacingModule { }
