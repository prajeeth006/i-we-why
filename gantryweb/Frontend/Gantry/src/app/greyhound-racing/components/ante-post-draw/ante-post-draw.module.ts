import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { GreyHoundRacingAntePostDrawComponent } from './ante-post-draw.component';
import { GreyHoundRacingAntePostDrawRoutingModule } from './ante-post-draw-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    GreyHoundRacingAntePostDrawComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    GreyHoundRacingAntePostDrawRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class GreyHoundRacingAntePostDrawModule { }
