import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tv2RoutingModule } from './tv2-routing.module';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { OutrightTv2Component } from './components/outright-tv2.component';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    OutrightTv2Component
  ],
  imports: [
    CommonModule,
    Tv2RoutingModule,
    GantryCommonModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class Tv2Module { }
