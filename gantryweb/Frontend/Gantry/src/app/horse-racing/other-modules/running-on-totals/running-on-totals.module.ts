import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunningOnTotalsRoutingModule } from './running-on-totals-routing.module';
import { RunningOnTotalsComponent } from '../../components/running-on-totals/running-on-totals.component';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';




@NgModule({
  declarations: [RunningOnTotalsComponent],
  imports: [
    CommonModule,
    GantryCommonModule,
    RunningOnTotalsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class RunningOnTotalsModule { }
