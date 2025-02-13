import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { StaticPromotionComponent } from './static-promotion.component';
import { StaticPromotionRoutingModule } from './static-promotion-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    StaticPromotionComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    StaticPromotionRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class StaticPromotionModule { }
