import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ClaimsService, NavigationService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { AccountUpgradeConfig } from './account-upgrade.client-config';

export const AccountUpgradeGuard = async (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const claimsService = inject(ClaimsService);
    const navigation = inject(NavigationService);
    const config = inject(AccountUpgradeConfig);

    const accBusinessPhase = claimsService.get('accbusinessphase');
    if (!accBusinessPhase || accBusinessPhase !== 'in-shop') {
        return true;
    }

    await firstValueFrom(config.whenReady);

    const currentUrlAllowed = config.allowedUrls.find((a) => state.url.indexOf(a) != -1);
    if (currentUrlAllowed) {
        return true;
    }

    navigation.goTo(config.redirectUrl, { appendReferrer: state.url });
    return false;
};
