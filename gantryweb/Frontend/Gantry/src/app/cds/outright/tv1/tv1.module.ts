import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tv1RoutingModule } from './tv1-routing.module';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { OutrightTv1Component } from './components/outright-tv1.component';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    OutrightTv1Component
  ],
  imports: [
    CommonModule,
    Tv1RoutingModule,
    GantryCommonModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class Tv1Module { }
