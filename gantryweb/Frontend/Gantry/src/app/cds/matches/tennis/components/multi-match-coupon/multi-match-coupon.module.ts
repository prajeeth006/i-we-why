import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiMatchCouponRoutingModule } from './multi-match-coupon-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';
import { MultiMatchCouponComponent } from './multi-match-coupon.component';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';


@NgModule({
  declarations: [MultiMatchCouponComponent],
  imports: [
    CommonModule,
    GantryCommonModule,
    MultiMatchCouponRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class MultiMatchCouponModule { }
