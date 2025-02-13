import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpsRoutingModule } from './eps-routing.module';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { EpsTemplateComponent } from './eps-template.component';
import { ErrorHandlerService } from 'src/app/error-handler.service';



@NgModule({
  declarations: [
    EpsTemplateComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    EpsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class EpsModule { }
