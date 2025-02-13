import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GolfCdsRoutingModule } from './golf-cds-routing.module';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';
import { GolfCdsComponent } from './components/golf-cds.component';


@NgModule({
  declarations: [
    GolfCdsComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    GolfCdsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class GolfCdsModule { }
