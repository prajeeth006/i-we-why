import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { GreyHoundRacingAntePostDrawRoutingModule } from './ante-post-draw-routing.module';
import { GreyHoundRacingAntePostDrawComponent } from './ante-post-draw.component';

@NgModule({
    declarations: [GreyHoundRacingAntePostDrawComponent],
    imports: [CommonModule, GantryCommonModule, GreyHoundRacingAntePostDrawRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class GreyHoundRacingAntePostDrawModule {}
