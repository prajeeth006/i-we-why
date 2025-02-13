import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { ErrorHandlerService } from '../error-handler.service';
import { SharedModule } from '../shared.module';
import { CarouselRoutingModule } from './carousel-routing.module';
import { CarouselComponent } from './component/carousel/carousel.component';

@NgModule({
    declarations: [CarouselComponent],
    imports: [CommonModule, CarouselRoutingModule, SharedModule, GantryCommonModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class CarouselModule {}
