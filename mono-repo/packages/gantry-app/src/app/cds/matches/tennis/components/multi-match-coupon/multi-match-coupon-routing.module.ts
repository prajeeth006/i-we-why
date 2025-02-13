import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeMultiMatchCouponComponent } from '../../../../dark-theme-matches/dark-theme-tennis/dark-multi-match-coupon/dark-theme-multi-match-coupon.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeMultiMatchCouponComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MultiMatchCouponRoutingModule {}
