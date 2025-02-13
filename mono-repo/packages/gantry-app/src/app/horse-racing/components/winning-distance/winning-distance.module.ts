import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeWinningDistanceComponent } from '../../dark-theme/components/dark-theme-winning-distance/dark-theme-winning-distance.component';
import { WinningDistanceRoutingModule } from './winning-distance-routing.module';

@NgModule({
    declarations: [DarkThemeWinningDistanceComponent],
    imports: [CommonModule, GantryCommonModule, WinningDistanceRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class WinningDistanceModule {}
