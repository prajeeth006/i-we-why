import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { ErrorHandlerService } from 'src/app/error-handler.service';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { Formula1CdsComponent } from "./components/formula1-cds.component";
import { Formula1CdsRoutingModule } from "./formula1-cds-routing.module";


@NgModule({
  declarations: [
    Formula1CdsComponent,
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    Formula1CdsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]

})

export class Formula1CdsModule {

}