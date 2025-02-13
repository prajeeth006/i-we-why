import { Inject, Injectable } from '@angular/core';

import {
    InboxService as CoreInboxService,
    InboxState,
    MENU_COUNTERS_PROVIDER,
    MenuAction,
    MenuActionsService,
    MenuCountersProvider,
    MenuCountersService,
    NativeAppService,
    NativeEventType,
    NavigationService,
    OnFeatureInit,
} from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { pairwise } from 'rxjs/operators';

import { InboxService } from './services/inbox.service';

@Injectable()
export class InboxBootstrapService implements OnFeatureInit {
    constructor(
        private menuActionsService: MenuActionsService,
        private accountMenuDataService: AccountMenuDataService,
        private menuCountersService: MenuCountersService,
        private inboxService: InboxService,
        private nativeAppService: NativeAppService,
        private accountMenuService: AccountMenuDataService,
        private navigationService: NavigationService,
        private coreInboxService: CoreInboxService,
        @Inject(MENU_COUNTERS_PROVIDER) private menuCountersProviders: MenuCountersProvider[],
    ) {}

    onFeatureInit() {
        this.coreInboxService.set(this.inboxService);
        this.menuCountersService.registerProviders(this.menuCountersProviders);
        this.menuActionsService.register(MenuAction.GOTO_INBOX, () => {
            this.inboxService.open({
                showBackButton: this.accountMenuDataService.routerMode,
                trackingEventName: 'Event.inbox.menu_action',
            });
        });

        this.inboxService.count.subscribe((count: number) => {
            this.menuCountersService.update();
            this.nativeAppService.sendToNative({
                eventName: NativeEventType.NotificationCount,
                parameters: {
                    inbox: count,
                },
            });
        });

        this.inboxService.state.pipe(pairwise()).subscribe((params: [InboxState, InboxState]) => {
            this.sendNativeAppEvent(params[1].isOpen);

            if (!params[1].isOpen && params[1].changeSource !== 'back') {
                // if closed after it was open in router mode account menu, close account menu as well
                if (this.accountMenuService.routerModeReturnUrl) {
                    this.navigationService.goTo(this.accountMenuService.routerModeReturnUrl);
                }
            }
        });
    }

    private sendNativeAppEvent(visible: boolean) {
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.SENSITIVEPAGE,
            parameters: {
                id: 'inbox',
                type: 'overlay',
                action: visible ? 'open' : 'close',
                isSensitiveForSliderGames: visible,
                isSensitiveForPushNotifications: visible,
            },
        });
    }
}
