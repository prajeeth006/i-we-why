import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { ReferredFriendsConfig } from '../src/referred-friends.client-config';
import { ReferredFriendsService } from '../src/referred-friends.service';

@Mock({ of: ReferredFriendsConfig })
export class ReferredFriendsConfigMock extends ReferredFriendsConfig {
    override whenReady = new Subject<void>();
    override content = {};
    override referredFriends = { friends: [] };
    override shareContent = <any>{};
    override invitationUrl = { url: 'https://example.com/' };

    constructor() {
        super();
    }
}

@Mock({ of: ReferredFriendsService })
export class ReferredFriendsServiceMock {
    isReferFriendVisible = new Subject<boolean>();
    invitationUrl = new BehaviorSubject('');
    @Stub() toggleReferFriend: jasmine.Spy;
    @Stub() toggleReferralCompleted: jasmine.Spy;
    @Stub() refresh: jasmine.Spy;
}
