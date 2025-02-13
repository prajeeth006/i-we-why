import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselRoutingModule } from './carousel-routing.module';
import { CarouselComponent } from './component/carousel/carousel.component';
import { SharedModule } from '../shared.module';
import { ErrorHandlerService } from '../error-handler.service';
import { GantryCommonModule } from '../common/gantry-common.module';


@NgModule({
  declarations: [
    CarouselComponent,
  ],
  imports: [
    CommonModule,
    CarouselRoutingModule,
    SharedModule,
    GantryCommonModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class CarouselModule { }
