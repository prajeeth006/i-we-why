import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { GantryCommonModule } from "../common/gantry-common.module";
import { ErrorHandlerService } from "../error-handler.service";
import { TennisComponent } from './components/tennis.component'
import { TennisRoutingModule } from "./tennis-routing.module";


@NgModule({
  declarations: [
    TennisComponent,
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    TennisRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]

})

export class TennisModule {

}