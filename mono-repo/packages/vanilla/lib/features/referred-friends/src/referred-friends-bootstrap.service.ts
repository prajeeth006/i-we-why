import { Injectable, inject } from '@angular/core';

import { MenuAction, MenuActionsService, OnFeatureInit, RtmsMessage, RtmsService, RtmsType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ReferredFriendsConfig } from './referred-friends.client-config';
import { ReferredFriendsService } from './referred-friends.service';

@Injectable()
export class ReferredFriendsBootstrapService implements OnFeatureInit {
    private config = inject(ReferredFriendsConfig);
    private referredFriendsService = inject(ReferredFriendsService);
    private menuActionsService = inject(MenuActionsService);
    private rtmsService = inject(RtmsService);

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        let isReferFriendVisible: boolean;
        this.referredFriendsService.isReferFriendVisible.subscribe((isVisible: boolean) => (isReferFriendVisible = isVisible));

        this.menuActionsService.register(MenuAction.TOGGLE_REFERRED_FRIENDS, () => {
            this.referredFriendsService.toggleReferFriend(!isReferFriendVisible);
        });

        // TODO: Adjust the event to the real one
        this.rtmsService.messages
            .pipe(filter((message: RtmsMessage) => message.type === RtmsType.REFERRAL_COMPLETED_EVENT))
            .subscribe((message: RtmsMessage) => {
                this.referredFriendsService.toggleReferralCompleted(true, message.payload);
            });
    }
}
