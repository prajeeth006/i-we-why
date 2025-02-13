import { inject } from '@angular/core';

import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { firstValueFrom } from 'rxjs';

export const profilePageGuard = async () => {
    const accountMenuConfig = inject(AccountMenuConfig);

    await firstValueFrom(accountMenuConfig.whenReady);

    return true;
};
