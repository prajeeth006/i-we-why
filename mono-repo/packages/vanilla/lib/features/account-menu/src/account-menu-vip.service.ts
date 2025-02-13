import { Injectable } from '@angular/core';

import { ClaimsService, MenuContentItem } from '@frontend/vanilla/core';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';

@Injectable({ providedIn: 'root' })
export class AccountMenuVipService {
    get isVip(): boolean {
        const vipLevel = this.vipLevel;
        return !!vipLevel && this.config.account.vipLevels.some((l) => l.toLowerCase() === vipLevel.toLowerCase());
    }

    get vipLevel() {
        return this.claimsService.get('http://api.bwin.com/v3/user/vipLevel')!;
    }

    get ignoreVipLevel() {
        return this.config.account.ignoreVipLevel;
    }

    get currentVipLevelItem(): MenuContentItem {
        return this.config.vipLevels.find((o) => o.name.toLowerCase() === 'level_' + (this.vipLevel || 'nonvip').toLowerCase())!;
    }

    get vipIcon() {
        return this.currentVipLevelItem.image.src;
    }

    get vipUrl() {
        return this.currentVipLevelItem.url;
    }

    get vipLabel() {
        return this.currentVipLevelItem.text;
    }

    constructor(
        private config: AccountMenuConfig,
        private claimsService: ClaimsService,
    ) {}
}
