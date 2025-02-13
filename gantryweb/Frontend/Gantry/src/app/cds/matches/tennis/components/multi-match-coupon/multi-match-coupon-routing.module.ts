import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiMatchCouponComponent } from './multi-match-coupon.component';

const routes: Routes = [
  {
    path: '',
    component: MultiMatchCouponComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiMatchCouponRoutingModule { }
