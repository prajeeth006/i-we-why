import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { CashierConfig } from '@frontend/vanilla/shared/cashier';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuickDepositService } from './quick-deposit.service';

export const quickDepositGuard = async (route: ActivatedRouteSnapshot) => {
    const quickDepositService = inject(QuickDepositService);
    const config = inject(CashierConfig);

    if (route.params['action'] !== 'deposit') {
        return true;
    }

    await firstValueFrom(config.whenReady);

    return firstValueFrom(
        quickDepositService.isEnabled().pipe(
            map((enabled: boolean) => {
                if (enabled) {
                    quickDepositService.open({ showKYCVerifiedMessage: false });
                    return false;
                }
                return true;
            }),
        ),
    );
};
