import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { WinningDistanceComponent } from './winning-distance.component';
import { WinningDistanceRoutingModule } from './winning-distance-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    WinningDistanceComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    WinningDistanceRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class WinningDistanceModule { }
