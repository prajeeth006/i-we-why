import { OverlayModule } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CashierNewOptions, LastKnownProductService, NavigationService } from '@frontend/vanilla/core';
import { CashierConfig } from '@frontend/vanilla/shared/cashier';
import { firstValueFrom } from 'rxjs';

import { CashierRouteAction } from './cashier.models';
import { CashierService } from './cashier.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [OverlayModule],
    selector: 'lh-cashier',
    template: '',
})
export class CashierComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private cashierConfig: CashierConfig,
        private navigation: NavigationService,
        private lastKnownProductService: LastKnownProductService,
        private cashierService: CashierService,
    ) {}

    async ngOnInit() {
        await firstValueFrom(this.cashierConfig.whenReady);

        const options: CashierNewOptions = {
            trackerId: this.navigation.location.search.get('trackerId') || this.cashierConfig.trackerIds.menu,
            returnUrl: this.navigation.location.search.get('returnUrl') || this.lastKnownProductService.get().url,
            replaceInHistory: true,
        };

        switch ((this.activatedRoute.snapshot.params.action || '').toLowerCase()) {
            case CashierRouteAction.Deposit:
                this.cashierService.goToCashierDeposit(options);
                break;
            case CashierRouteAction.Withdrawal:
                this.cashierService.goToCashierWithdrawal(options);
                break;
            case CashierRouteAction.TransactionHistory:
                this.cashierService.goToTransactionHistory(options);
                break;
            case CashierRouteAction.PaymentPreferences:
                this.cashierService.goToPaymentPreferences(options);
                break;
            default:
                this.cashierService.goToCashier(options);
                break;
        }
    }
}
