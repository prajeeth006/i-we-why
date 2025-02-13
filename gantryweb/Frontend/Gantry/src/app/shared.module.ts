
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common'

import { ErrorHandler, NgModule } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  declarations: [SliderComponent],
  exports: [SliderComponent],
  imports: [CommonModule],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})

export class SharedModule { }