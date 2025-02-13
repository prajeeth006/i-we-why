import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeMoneyboxComponent } from '../../dark-theme/components/dark-theme-moneybox/dark-theme-moneybox.component';
import { MoneyboxRoutingModule } from './moneybox-routing.module';

@NgModule({
    declarations: [DarkThemeMoneyboxComponent],
    imports: [CommonModule, GantryCommonModule, MoneyboxRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class MoneyboxModule {}
