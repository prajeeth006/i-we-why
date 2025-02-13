import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { HotShowRoutingModule } from './hot-show-routing';
import { HotShowComponent } from '../../components/hot-show/hot-show.component';
import { ErrorHandlerService } from 'src/app/error-handler.service';




@NgModule({
  declarations: [
    HotShowComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HotShowRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class HotShowModule { }
