import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { NonRunnersRoutingModule } from './non-runners-routing.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, GantryCommonModule, NonRunnersRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class NonRunnersModule {}
