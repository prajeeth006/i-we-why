import { inject } from '@angular/core';

import { LogoutPageResourceService } from './logout-page-resource.service';

export const logoutPageResolver = () => {
    const resource = inject(LogoutPageResourceService);
    return resource.getInitData();
};
