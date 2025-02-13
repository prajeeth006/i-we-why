import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeMoneyBoostComponent } from '../../dark-theme/components/dark-theme-money-boost/dark-theme-money-boost.component';
import { MoneyBoostRoutingModule } from './money-boost-routing.module';

@NgModule({
    declarations: [DarkThemeMoneyBoostComponent],
    imports: [CommonModule, GantryCommonModule, MoneyBoostRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class MoneyBoostModule {}
