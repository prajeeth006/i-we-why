import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeGolfCdsComponent } from '../../dark-theme-matches/dark-theme-golf-cds/dark-theme-golf-cds.component';
import { GolfCdsRoutingModule } from './golf-cds-routing.module';

@NgModule({
    declarations: [DarkThemeGolfCdsComponent],
    imports: [CommonModule, GantryCommonModule, GolfCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class GolfCdsModule {}
