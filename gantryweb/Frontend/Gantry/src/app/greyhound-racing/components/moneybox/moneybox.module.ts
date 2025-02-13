import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { MoneyboxComponent } from './moneybox.component';
import { MoneyboxRoutingModule } from './moneybox-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    MoneyboxComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    MoneyboxRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class MoneyboxModule { }
