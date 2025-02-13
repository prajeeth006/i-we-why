import { inject } from '@angular/core';

import { LoginNavigationService, UserService } from '@frontend/vanilla/core';

export const newVisitorPageGuard = () => {
    const user = inject(UserService);
    const loginNavigation = inject(LoginNavigationService);
    if (user.isAuthenticated) {
        loginNavigation.goToHome();
        return false;
    }
    return true;
};
