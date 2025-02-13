import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { ErrorHandlerService } from '../error-handler.service';
import { DashStreamComponent } from './components/dash-stream.component';
import { DashStreamRoutingModule } from './dash-stream-routing.module';

@NgModule({
    declarations: [DashStreamComponent],
    imports: [CommonModule, GantryCommonModule, DashStreamRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class DashStreamModule {}
