import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { RunningOnTotalsComponent } from '../../components/running-on-totals/running-on-totals.component';
import { RunningOnTotalsRoutingModule } from './running-on-totals-routing.module';

@NgModule({
    declarations: [RunningOnTotalsComponent],
    imports: [CommonModule, GantryCommonModule, RunningOnTotalsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class RunningOnTotalsModule {}
