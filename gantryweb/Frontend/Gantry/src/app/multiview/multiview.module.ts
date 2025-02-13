import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiviewComponent } from './component/multiview/multiview.component';
import { MultiviewRoutingModule } from './multiview-routing.module'
import { SharedModule } from '../shared.module';
import { ErrorHandlerService } from '../error-handler.service';



@NgModule({
  declarations: [
    MultiviewComponent
  ],
  imports: [
    CommonModule,
    MultiviewRoutingModule,
    SharedModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class MultiviewModule { }
