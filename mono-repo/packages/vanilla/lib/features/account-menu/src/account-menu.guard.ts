import { inject } from '@angular/core';

import { MenuActionOrigin, MenuActionsService, Page, UserService } from '@frontend/vanilla/core';
import { AccountMenuConfig, AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { firstValueFrom } from 'rxjs';

export const accountMenuGuard = async (): Promise<boolean> => {
    const user = inject(UserService);
    const page = inject(Page);
    const accountMenuDataService = inject(AccountMenuDataService);
    const menuActionService = inject(MenuActionsService);
    const config = inject(AccountMenuConfig);

    if (!accountMenuDataService.routerModeReturnUrl) {
        // ensure return url when navigating directly to the menu through loading the page
        accountMenuDataService.setReturnUrlCookie(page.homePage);
    }

    await firstValueFrom(config.whenReady);

    if (user.isAuthenticated || accountMenuDataService.routerMode || config.account.version === 4) {
        return true;
    }

    menuActionService.invoke('gotoHome', MenuActionOrigin.Menu);

    return false;
};
