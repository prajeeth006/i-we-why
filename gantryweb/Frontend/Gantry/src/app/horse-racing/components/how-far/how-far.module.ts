import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { HowFarComponent } from './how-far.component';
import { HowFarRoutingModule } from './how-far-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    HowFarComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HowFarRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class HowFarModule { }
