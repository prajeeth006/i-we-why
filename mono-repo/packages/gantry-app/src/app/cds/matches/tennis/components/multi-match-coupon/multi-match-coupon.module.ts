import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { SentenceCasePipe } from 'packages/gantry-app/src/app/common/pipes/sentence-case.pipe';

import { GantryCommonModule } from '../../../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../../../error-handler.service';
import { DarkThemeMultiMatchCouponComponent } from '../../../../dark-theme-matches/dark-theme-tennis/dark-multi-match-coupon/dark-theme-multi-match-coupon.component';
import { MultiMatchCouponRoutingModule } from './multi-match-coupon-routing.module';

@NgModule({
    declarations: [DarkThemeMultiMatchCouponComponent],
    imports: [CommonModule, GantryCommonModule, MultiMatchCouponRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }, SentenceCasePipe],
})
export class MultiMatchCouponModule {}
