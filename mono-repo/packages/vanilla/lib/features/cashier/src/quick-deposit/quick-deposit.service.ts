import { Injectable, InjectionToken } from '@angular/core';

import { UserService } from '@frontend/vanilla/core';
import { CashierConfig } from '@frontend/vanilla/shared/cashier';
import { Observable, Subject, of } from 'rxjs';

import { CashierResourceService } from '../cashier-resource.service';
import { QuickDepositAction, QuickDepositEvent, QuickDepositOptions } from './quick-deposit.models';

/**
 * @whatItDoes Opens quick deposit overlay
 *
 * @howToUse
 *
 * ```this.quickDepositService.open();```
 *
 * @description
 *
 * Cashier will be opened within the modal dialog. User balance gets updated if deposit is made.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class QuickDepositService {
    readonly events = new Subject<QuickDepositEvent>();

    constructor(
        private cashierConfig: CashierConfig,
        private userService: UserService,
        private cashierResourceService: CashierResourceService,
    ) {}

    open(options: QuickDepositOptions) {
        this.events.next({ action: QuickDepositAction.Open, options });
    }

    isEnabled(): Observable<boolean> {
        if (!this.cashierConfig.isQuickDepositEnabled || !this.userService.isAuthenticated) {
            return of(false);
        }

        return this.cashierResourceService.quickDepositEnabled();
    }
}

export const QUICK_DEPOSIT_OPTIONS = new InjectionToken<QuickDepositOptions>('QUICK_DEPOSIT_OPTIONS');
