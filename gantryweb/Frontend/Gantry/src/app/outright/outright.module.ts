import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../common/gantry-common.module';
import { OutrightRoutingModule } from './outright-routing.module';
import { OutrightTemplateComponent } from './components/outright-template/outright-template.component';
import { ErrorHandlerService } from '../error-handler.service';
import { ManualOutrightTemplateComponent } from './components/manual-outright-template/manual-outright-template.component';




@NgModule({
  declarations: [
    OutrightTemplateComponent,
    ManualOutrightTemplateComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    OutrightRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class OutrightModule { }
