import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../common/gantry-common.module';
import { Formula1templateComponent } from './components/formula1template/formula1template.component';
import { Formula1RoutingModule } from './formula1-routing.module';
import { ErrorHandlerService } from '../error-handler.service';



@NgModule({
  declarations: [
    Formula1templateComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    Formula1RoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class Formula1Module { }
