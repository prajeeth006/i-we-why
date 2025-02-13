import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeNflCdsComponent } from '../../dark-theme-matches/dark-theme-nfl-cds/dark-theme-nfl-cds.component';
import { NflCdsRoutingModule } from './nfl-cds-routing.module';

@NgModule({
    declarations: [DarkThemeNflCdsComponent],
    imports: [CommonModule, GantryCommonModule, NflCdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class NflCdsModule {}
