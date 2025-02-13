import { inject } from '@angular/core';

import { DslService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { HomePageConfig } from './home-page.client-config';

export const homePageGuard = async () => {
    const config = inject(HomePageConfig);
    const dslService = inject(DslService);
    await firstValueFrom(config.whenReady);
    return firstValueFrom(dslService.evaluateExpression<boolean>(config.isEnabledCondition));
};
