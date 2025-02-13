import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { NonRunnersComponent } from './non-runners.component';
import { NonRunnersRoutingModule } from './non-runners-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    NonRunnersComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    NonRunnersRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class NonRunnersModule { }
