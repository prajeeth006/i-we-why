import { Injectable, inject } from '@angular/core';

import {
    MenuAction,
    MenuActionsService,
    NativeAppService,
    NativeEventType,
    NavigationService,
    OnFeatureInit,
    ParsedUrl,
    UrlService,
    WINDOW,
} from '@frontend/vanilla/core';

/**
 * @whatItDoes Bootstraps features needed by the `ZenDesk` chat.
 *
 * @stable
 */
@Injectable()
export class ZendeskBootstrapService implements OnFeatureInit {
    readonly #window = inject(WINDOW);

    constructor(
        private navigationService: NavigationService,
        private urlService: UrlService,
        private nativeAppService: NativeAppService,
        private menuActionsService: MenuActionsService,
    ) {}

    onFeatureInit() {
        this.menuActionsService.register(MenuAction.OPEN_ZENDESK_CHAT, () => this.openZendesk());
        this.navigationService.locationChange.subscribe((event) => {
            const nextUrl = this.urlService.parse(event.nextUrl);
            this.openChatOnStartup(nextUrl);
        });
    }

    private openChatOnStartup(currentUrl: ParsedUrl) {
        const isOpenChatQueryStringPresent = (currentUrl.search.get('chat') || '').toUpperCase() == 'OPEN';
        if (isOpenChatQueryStringPresent) {
            this.nativeAppService.sendToNative({ eventName: NativeEventType.OPEN_CHAT });
        }
    }

    private openZendesk() {
        const window = <any>this.#window;

        if (window.gvczendesk && window.gvczendesk.livechatclick) {
            window.gvczendesk.livechatclick();
        }
    }
}
