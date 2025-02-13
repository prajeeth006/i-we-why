import { GenericListItem, MenuContentItem } from '@frontend/vanilla/core';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { AccountMenuContentMain } from '../../../shared/account-menu/account-menu.models';

@Mock({ of: AccountMenuConfig })
export class AccountMenuConfigMock {
    whenReady = new Subject<void>();
    account: AccountMenuContentMain = <any>{
        pokerCashbackTournamentAwardTypes: [],
    };
    resources: GenericListItem = { messages: {} };
    vipLevels: MenuContentItem[] = [];
    onBoarding: any;
}
