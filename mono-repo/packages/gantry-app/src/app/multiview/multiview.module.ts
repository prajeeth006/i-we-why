import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { ErrorHandlerService } from '../error-handler.service';
import { SharedModule } from '../shared.module';
import { MultiviewComponent } from './component/multiview/multiview.component';
import { MultiviewRoutingModule } from './multiview-routing.module';

@NgModule({
    declarations: [MultiviewComponent],
    imports: [CommonModule, MultiviewRoutingModule, SharedModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class MultiviewModule {}
