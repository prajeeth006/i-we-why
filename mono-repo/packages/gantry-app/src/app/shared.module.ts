import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { ErrorHandlerService } from './error-handler.service';
import { SliderComponent } from './slider/slider.component';

@NgModule({
    declarations: [SliderComponent],
    exports: [SliderComponent],
    imports: [CommonModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class SharedModule {}
