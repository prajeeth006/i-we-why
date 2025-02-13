import { Injectable } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/** @stable */
export interface CashierNewOptions {
    /** Enables specifying custom cashier path. */
    pathTemplate?: string;
    trackerId?: string | undefined; // Optional undefined
    returnUrl?: string;
    replaceInHistory?: boolean;
    skipTracking?: boolean;
    appendReturnUrl?: boolean;
    skipQuickDeposit?: boolean;
    cashierTargetWindow?: 'self' | 'top' | 'parent' | null;
    queryParameters?: { [key: string]: string };
    customTracking?: {
        eventName: string;
        data: { [key: string]: string };
    };
}

export interface CashierGoToDepositHook {
    enabled: () => Promise<boolean>;
    fn: () => void;
}

/**
 * @whatItDoes Provides cashier integration.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class CashierService extends LazyServiceProviderBase {
    private hooks: CashierGoToDepositHook[] = [];

    /** Provides a way to add hook which will be executed at start of goToDeposit method. */
    registerGoToDepositHook(hook: CashierGoToDepositHook) {
        this.hooks.push(hook);
    }

    /** Executes first enabled hook and resolves with true. Otherwise with false. */
    async runDepositHooks(): Promise<boolean> {
        for (const hook of this.hooks) {
            if (await hook.enabled()) {
                hook.fn();
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }

    goToCashier(options: CashierNewOptions) {
        this.inner.goToCashier(options);
    }

    goToCashierDeposit(options: CashierNewOptions) {
        this.inner.goToCashierDeposit(options);
    }

    goToCashierWithdrawal(options: CashierNewOptions) {
        this.inner.goToCashierWithdrawal(options);
    }

    goToManageMyCards(options: CashierNewOptions) {
        this.inner.goToManageMyCards(options);
    }

    goToTransactionHistory(options: CashierNewOptions) {
        this.inner.goToTransactionHistory(options);
    }

    generateCashierUrl(options: CashierNewOptions) {
        return this.inner.generateCashierUrl(options);
    }

    handlePartialRegistration(origin: string, returnUrl?: string, options?: CashierNewOptions) {
        this.inner.handlePartialRegistration(origin, returnUrl, options);
    }
}
