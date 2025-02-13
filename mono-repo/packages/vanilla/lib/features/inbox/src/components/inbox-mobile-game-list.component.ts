import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { NativeAppService, NavigationService, WINDOW, trackByProp } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { OfferStatus } from '@frontend/vanilla/shared/offers';

import { InboxMessage } from '../services/inbox.models';
import { InboxMessageChannelsComponent } from './inbox-message-channels.component';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, InboxMessageChannelsComponent],
    selector: 'lh-inbox-mobile-game-list',
    templateUrl: 'inbox-mobile-game-list.component.html',
})
export class InboxMobileGameListComponent implements OnInit {
    @Input() message: InboxMessage;
    @Input() contentMessages: { [key: string]: string };
    isGameListHidden: boolean;
    readonly trackByTitle = trackByProp('title');
    readonly trackBySectionTitle = trackByProp('sectionTitle');

    readonly #window = inject(WINDOW);

    constructor(
        private nativeApplication: NativeAppService,
        private vanillaNavigation: NavigationService,
    ) {}

    ngOnInit(): void {
        this.isGameListHidden =
            (!this.message.mobileGameList || this.message.mobileGameList.length === 0) &&
            (!this.message.mobileAllList || this.message.mobileAllList.length === 0) &&
            !this.message.isAllMobileGames;
    }

    isBonusApplied(): boolean {
        return this.message.sourceStatus === OfferStatus.OFFER_CLAIMED && !this.message.isExpired;
    }

    goTo(linkUrl: string): void {
        if (linkUrl) {
            if (this.nativeApplication.isNativeApp) {
                this.#window.location.href = linkUrl;
            } else {
                this.vanillaNavigation.goTo(linkUrl, { forceReload: true });
            }
        }
    }

    getSectionTitle(sectionTitle: string): string {
        return this.contentMessages['GameSection.' + sectionTitle.replace(' ', '')] || sectionTitle;
    }
}
