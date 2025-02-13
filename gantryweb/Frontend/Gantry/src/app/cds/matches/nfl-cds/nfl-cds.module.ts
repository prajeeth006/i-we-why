
import { ErrorHandler, NgModule } from "@angular/core";
import { GantryCommonModule } from "src/app/common/gantry-common.module";
import { ErrorHandlerService } from "src/app/error-handler.service";
import { CommonModule } from '@angular/common';
import { NflCdsRoutingModule } from './nfl-cds-routing.module';
import { NflCdsComponent } from "./components/nfl-cds.component";

@NgModule({
  declarations: [
    NflCdsComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    NflCdsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class NflCdsModule { }
