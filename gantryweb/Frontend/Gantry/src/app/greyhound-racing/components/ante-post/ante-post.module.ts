import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { GreyHoundRacingAntePostComponent } from './ante-post.component';
import { GreyHoundRacingAntePostRoutingModule } from './ante-post-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    GreyHoundRacingAntePostComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    GreyHoundRacingAntePostRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class GreyHoundRacingAntePostModule { }
