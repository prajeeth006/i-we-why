import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";

import { TennisCdsRoutingModule } from "./tennis-cds-routing.module";
import { TennisCdsComponent } from "./components/tennis-cds.component";
import { GantryCommonModule } from "src/app/common/gantry-common.module";
import { ErrorHandlerService } from "src/app/error-handler.service";

@NgModule({
  declarations: [
    TennisCdsComponent,
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    TennisCdsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]

})

export class TennisCdsModule {

}