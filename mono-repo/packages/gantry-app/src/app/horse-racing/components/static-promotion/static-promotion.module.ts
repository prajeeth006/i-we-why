import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { StaticPromotionRoutingModule } from './static-promotion-routing.module';
import { StaticPromotionComponent } from './static-promotion.component';

@NgModule({
    declarations: [StaticPromotionComponent],
    imports: [CommonModule, GantryCommonModule, StaticPromotionRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class StaticPromotionModule {}
