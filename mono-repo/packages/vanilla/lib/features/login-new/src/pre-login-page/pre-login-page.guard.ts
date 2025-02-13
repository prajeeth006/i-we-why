import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { DeviceService, NavigationService, UserService } from '@frontend/vanilla/core';

export const preLoginPageGuard = (route: ActivatedRouteSnapshot) => {
    const user = inject(UserService);
    const navigation = inject(NavigationService);
    const deviceService = inject(DeviceService);

    const url = route.queryParams['url'];
    const origin = route.queryParams['origin'];
    if (!url || !origin) {
        throw new Error('url and origin must be provided in order to access this page');
    }
    if (user.isAuthenticated || !deviceService.isMobilePhone) {
        navigation.goTo(url);
        return false;
    }

    return true;
};
