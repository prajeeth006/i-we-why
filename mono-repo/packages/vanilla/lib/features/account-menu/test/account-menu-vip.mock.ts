import { Mock } from 'moxxi';

import { AccountMenuVipService } from '../src/account-menu-vip.service';

@Mock({ of: AccountMenuVipService })
export class AccountMenuVipServiceMock {
    isVip: boolean;
    vipLabel: string;
    vipText: string;
    vipIcon: string;
}
