import { Injectable } from '@angular/core';

import {
    CashierNewOptions,
    CashierService as CoreCashierService,
    MenuAction,
    MenuActionOrigin,
    MenuActionsService,
    NavigationService,
    OnFeatureInit,
    ProductHomepagesConfig,
    ToastrQueueService,
    TrackingService,
    UserEvent,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { CashierConfig } from '@frontend/vanilla/shared/cashier';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CashierService } from './cashier.service';
import { QuickDepositOverlayService } from './quick-deposit/quick-deposit-overlay.service';
import { QuickDepositAction, QuickDepositEvent } from './quick-deposit/quick-deposit.models';
import { QuickDepositService } from './quick-deposit/quick-deposit.service';

@Injectable()
export class CashierBootstrapService implements OnFeatureInit {
    constructor(
        private cashierConfig: CashierConfig,
        private cashierService: CashierService,
        private coreCashierService: CoreCashierService,
        private navigation: NavigationService,
        private menuActionsService: MenuActionsService,
        private accountMenuService: AccountMenuDataService,
        private toastrQueueService: ToastrQueueService,
        private user: UserService,
        private productHomepagesConfig: ProductHomepagesConfig,
        private quickDepositService: QuickDepositService,
        private quickDepositOverlayService: QuickDepositOverlayService,
        private trackingService: TrackingService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.cashierConfig.whenReady);

        this.coreCashierService.set(this.cashierService);

        this.menuActionsService.register(MenuAction.GOTO_CASHIER, (origin: string) => {
            const options = this.getCashierOptions(origin);

            if (origin === MenuActionOrigin.Header) {
                // use deposit action here
                this.cashierService.goToCashierDeposit(options);
            } else {
                this.cashierService.goToCashier(options);
            }
        });
        this.menuActionsService.register(MenuAction.GOTO_DEPOSIT, async (origin: string) => {
            const hookDetected = await this.coreCashierService.runDepositHooks();
            if (hookDetected) return;

            const options = this.getCashierOptions(origin);
            options.skipQuickDeposit = !this.cashierConfig.quickDepositAllowedOrigins[origin.toLowerCase()];
            this.cashierService.handlePartialRegistration(origin, this.accountMenuService.routerModeReturnUrl, options);
        });
        this.menuActionsService.register(MenuAction.GOTO_WITHDRAWAL, (origin: string) => {
            const options = this.getCashierOptions(origin);
            this.cashierService.goToCashierWithdrawal(options);
        });
        this.menuActionsService.register(MenuAction.GOTO_MANAGE_MY_CARDS, (origin: string) => {
            const options = this.getCashierOptions(origin);
            this.cashierService.goToManageMyCards(options);
        });
        this.menuActionsService.register(MenuAction.GOTO_TRANSACTION_HISTORY, (origin: string) => {
            const options = this.getCashierOptions(origin);
            this.cashierService.goToTransactionHistory(options);
        });
        this.menuActionsService.register(MenuAction.GOTO_PAYMENT_PREFERENCES, (origin: string) => {
            const options = this.getCashierOptions(origin);
            this.cashierService.goToPaymentPreferences(options);
        });
        this.menuActionsService.register(MenuAction.DEPOSIT_PROMPT_ACTION, (origin: string) => {
            const options = this.getCashierOptions(origin);

            if (this.toastrQueueService.currentToast) {
                const contextToastContent = this.toastrQueueService.currentToast.content;
                this.trackingService.getContentItemTracking(contextToastContent.parameters, 'tracking.ActionEvent').subscribe((tracking) => {
                    if (tracking) {
                        options.customTracking = {
                            eventName: tracking.event,
                            data: tracking.data,
                        };
                    }
                });
            }

            this.cashierService.goToCashierDeposit(options);
        });
        this.menuActionsService.register(MenuAction.HEADER_BALANCE_ACTION, () => {
            if (!this.user.realPlayer) {
                this.cashierService.goToCashierDeposit({});
            } else if (!this.navigation.location.absUrl().includes('/mobileportal/balancebreakdown')) {
                //Todo: Avoid appending rurl multiple times to the url. Remove when fixed on Vanilla side
                this.navigation.goTo(this.productHomepagesConfig.portal + '/mobileportal/balancebreakdown', {
                    appendReferrer: this.navigation.location.absUrl(),
                });
            }
        });

        if (this.cashierConfig.isQuickDepositEnabled) {
            if (this.user.isAuthenticated) {
                this.initQuickDeposit();
            } else {
                this.user.events.pipe(filter((event: UserEvent) => event instanceof UserLoginEvent)).subscribe(() => this.initQuickDeposit());
            }
        }
    }

    private initQuickDeposit() {
        this.quickDepositService.events.subscribe((event: QuickDepositEvent) => {
            if (event.action === QuickDepositAction.Open) {
                this.quickDepositOverlayService.show(event.options);
            }
        });
    }

    private getCashierOptions(origin: string): CashierNewOptions {
        const trackerId = this.cashierConfig.trackerIds[origin.toLowerCase()] || '';
        const returnUrl = this.navigation.location.absUrl() || this.accountMenuService.routerModeReturnUrl;

        return {
            trackerId,
            returnUrl,
        };
    }
}
