import { Injectable, inject } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { CookieBannerService } from './cookie-banner.service';

@Injectable()
export class CookieBannerBootstrapService implements OnFeatureInit {
    private service = inject(CookieBannerService);

    onFeatureInit() {
        this.service.setOptanonGroupCookie();
    }
}
