import { inject } from '@angular/core';

import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { firstValueFrom } from 'rxjs';

export const darkModeGuard = async () => {
    const config = inject(AccountMenuConfig);
    await firstValueFrom(config.whenReady);
    return true;
};
