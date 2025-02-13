import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../..../../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeFormula1CdsComponent } from '../../dark-theme-matches/dark-theme-formula1-cds/components/dark-theme-formula1-cds.component';
import { Formula1CdsRoutingModule } from './formula1-cds-routing.module';

@NgModule({
    declarations: [DarkThemeFormula1CdsComponent],
    imports: [CommonModule, GantryCommonModule, Formula1CdsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class Formula1CdsModule {}
