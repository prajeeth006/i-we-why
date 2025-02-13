import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../common/gantry-common.module';
import { AvrResultComponent } from './components/avr-result/avr-result.component';
import { AvrRoutingModule } from './avr-routing.module';
import { AvrComponent } from './components/avr/avr.component';
import { AvrPreambleComponent } from './components/avr-preamble/avr-preamble.component';
import { AvrVideoComponent } from './components/avr-video/avr-video.component';
import { AvrBannerComponent } from './components/avr-banner/avr-banner.component';
import { ErrorHandlerService } from '../error-handler.service';
import { AvrMotorPreambleComponent } from './components/avr-motor-preamble/avr-motor-preamble.component';


@NgModule({
  declarations: [
    AvrResultComponent,
    AvrComponent,
    AvrPreambleComponent,
    AvrVideoComponent,
    AvrBannerComponent,
    AvrMotorPreambleComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    AvrRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class AvrModule { }
