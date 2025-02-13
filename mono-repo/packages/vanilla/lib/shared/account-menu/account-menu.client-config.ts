import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    GenericListItem,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
} from '@frontend/vanilla/core';

import { AccountMenuContentMain, OnBoardingContent } from './account-menu.models';

/** @stable */
@LazyClientConfig({ key: 'vnAccountMenu', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: accountMenuConfigFactory,
})
export class AccountMenuConfig extends LazyClientConfigBase {
    account: AccountMenuContentMain;
    resources: GenericListItem;
    vipLevels: MenuContentItem[];
    onBoarding: OnBoardingContent;
}

export function accountMenuConfigFactory(service: LazyClientConfigService) {
    return service.get(AccountMenuConfig);
}
