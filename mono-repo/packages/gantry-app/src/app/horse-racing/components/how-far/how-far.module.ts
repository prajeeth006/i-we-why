import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeHowFarComponent } from '../../dark-theme/components/dark-theme-how-far/dark-theme-how-far.component';
import { HowFarRoutingModule } from './how-far-routing.module';

@NgModule({
    declarations: [DarkThemeHowFarComponent],
    imports: [CommonModule, GantryCommonModule, HowFarRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class HowFarModule {}
