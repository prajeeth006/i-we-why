import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { ErrorHandlerService } from '../error-handler.service';
import { NrmComponent } from './components/nrm.component';
import { NrmRoutingModule } from './nrm-routing.module';

@NgModule({
    declarations: [NrmComponent],
    imports: [CommonModule, NrmRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class NrmModule {}
