import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { HomeDrawAwayComponent } from './home-draw-away.component';
import { HomeDrawAwayRoutingModule } from './home-draw-away-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    HomeDrawAwayComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HomeDrawAwayRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]

})
export class HomeDrawAwayModule { }
