import { Injectable } from '@angular/core';

import { ConfigService } from '@rtms/client';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { AppInfoConfig } from '../client-config/app-info.client-config';
import { ClaimType } from '../user/user.models';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root',
})
export class RtmsConfigService implements ConfigService {
    constructor(
        private appInfoConfig: AppInfoConfig,
        private userService: UserService,
        private cookieService: CookieService,
    ) {}

    params(): any {
        const params: any = {
            brand: this.appInfoConfig.brand,
            frontend: this.appInfoConfig.frontend,
            product: this.appInfoConfig.product,
            channel: this.appInfoConfig.channel,
            trackerId: this.cookieService.get(CookieName.TrackerId),
        };

        if (this.userService.isAuthenticated) {
            params.user = this.userService.id;
            params.sso = this.userService.ssoToken;
            params.country = this.userService.country;
            params.loyaltyCategory = this.userService.loyalty;
            params.tierCode = this.userService.claims.get(ClaimType.TierCode);
            params.vipLevel = this.userService.claims.get(ClaimType.VipLevel);
        }

        return params;
    }
}
