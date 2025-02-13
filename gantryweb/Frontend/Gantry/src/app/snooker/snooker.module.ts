import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { GantryCommonModule } from "../common/gantry-common.module";
import { SnookerTemplateComponent } from "./components/snooker-template/snooker-template.component";
import { SnookerRoutingModule } from "./snooker-routing.module";
import { MatchResultComponent } from './components/markets/match-result/match-result.component';
import { MarketResultsComponent } from './components/markets/market-results/market-results.component';
import { TotalframesBettingComponent } from './components/markets/totalframes-betting/totalframes-betting.component';
import { ErrorHandlerService } from "../error-handler.service";

@NgModule({
  declarations: [
    SnookerTemplateComponent,
    MatchResultComponent,
    MarketResultsComponent,
    TotalframesBettingComponent

  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    SnookerRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class SnookerModule { }