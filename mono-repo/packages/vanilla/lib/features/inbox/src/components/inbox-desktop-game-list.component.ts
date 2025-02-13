import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { trackByProp } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { InboxMessage } from '../services/inbox.models';
import { InboxMessageChannelsComponent } from './inbox-message-channels.component';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, InboxMessageChannelsComponent],
    selector: 'lh-inbox-desktop-game-list',
    templateUrl: 'inbox-desktop-game-list.component.html',
})
export class InboxDesktopGameListComponent implements OnInit {
    @Input() message: InboxMessage;
    @Input() contentMessages: { [key: string]: string };
    isGameListHidden: boolean;
    readonly trackByTitle = trackByProp('title');
    readonly trackBySectionTitle = trackByProp('sectionTitle');

    ngOnInit() {
        this.isGameListHidden =
            (!this.message.desktopGameList || this.message.desktopGameList.length === 0) &&
            (!this.message.desktopAllList || this.message.desktopAllList.length === 0) &&
            !this.message.isAllDesktopGames;
    }

    getSectionTitle(sectionTitle: string): string {
        return this.contentMessages['GameSection.' + sectionTitle.replace(' ', '')] || sectionTitle;
    }
}
