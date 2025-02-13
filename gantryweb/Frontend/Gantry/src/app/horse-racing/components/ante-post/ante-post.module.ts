import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { HorseRacingAntePostComponent } from './ante-post.component';
import { HorseRacingAntePostRoutingModule } from './ante-post-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';

@NgModule({
  declarations: [
    HorseRacingAntePostComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HorseRacingAntePostRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class HorseRacingAntePostModule { }
