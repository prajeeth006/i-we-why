import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { ReferredFriendsService } from './referred-friends.service';

@Injectable()
export class ReferredFriendsDslValuesProvider implements DslValuesProvider {
    private invitationUrl: string;
    private loaded = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private referredFriendsService: ReferredFriendsService,
        private userService: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.referredFriendsService.invitationUrl.subscribe((invitationUrl: string) => {
            this.invitationUrl = invitationUrl;
            dslCacheService.invalidate(['referredFriends']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            ReferredFriends: this.dslRecorderService.createRecordable('referredFriends').createProperty({
                name: 'InvitationUrl',
                get: () => this.getCurrentValue(),
                deps: ['referredFriends', 'user.isAuthenticated'],
            }),
        };
    }

    private getCurrentValue() {
        if (!this.userService.isAuthenticated) {
            return '';
        }

        if (!this.loaded) {
            this.loaded = true;
            this.referredFriendsService.refresh();
        }

        return this.invitationUrl || DSL_NOT_READY;
    }
}
