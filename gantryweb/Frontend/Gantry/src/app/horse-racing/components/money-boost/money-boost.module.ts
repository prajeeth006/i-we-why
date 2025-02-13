import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { MoneyBoostComponent } from './money-boost.component';
import { MoneyBoostRoutingModule } from './money-boost-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    MoneyBoostComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    MoneyBoostRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class MoneyBoostModule { }
