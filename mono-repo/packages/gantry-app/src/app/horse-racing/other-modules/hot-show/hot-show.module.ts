import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { HotShowComponent } from '../../components/hot-show/hot-show.component';
import { HotShowRoutingModule } from './hot-show-routing';

@NgModule({
    declarations: [HotShowComponent],
    imports: [CommonModule, GantryCommonModule, HotShowRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class HotShowModule {}
