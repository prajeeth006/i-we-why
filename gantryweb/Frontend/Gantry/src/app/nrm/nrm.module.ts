import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NrmRoutingModule } from './nrm-routing.module';
import { NrmComponent } from './components/nrm.component';
import { ErrorHandlerService } from '../error-handler.service';




@NgModule({
  declarations: [
    NrmComponent
  ],
  imports: [
    CommonModule,
    NrmRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class NrmModule { }
