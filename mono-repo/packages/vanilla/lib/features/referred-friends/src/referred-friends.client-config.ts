import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

import { InvitationUrl, ReferredFriends } from './referred-friends.models';

@LazyClientConfig({ key: 'vnReferredFriends', product: ClientConfigProductName.SF })
@Injectable()
export class ReferredFriendsConfig extends LazyClientConfigBase {
    content: { [key: string]: ViewTemplateForClient };
    detailsButton: MenuContentItem;
    trackReferralsButton: MenuContentItem;
    shareContent: MenuContentItem;
    referredFriends: ReferredFriends;
    invitationUrl: InvitationUrl;
}

export function referredFriendsConfigFactory(service: LazyClientConfigService): ReferredFriendsConfig {
    return service.get(ReferredFriendsConfig);
}
