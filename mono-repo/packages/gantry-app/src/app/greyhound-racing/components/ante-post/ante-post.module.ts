import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { GreyHoundRacingAntePostRoutingModule } from './ante-post-routing.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, GantryCommonModule, GreyHoundRacingAntePostRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class GreyHoundRacingAntePostModule {}
