import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { trackByItem } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'lh-inbox-message-channels',
    templateUrl: 'inbox-message-channels.component.html',
})
export class InboxMessageChannelsComponent {
    @Input() channelList: string[];
    @Input() contentMessages: { [key: string]: string };
    @Input() sectionTitle: string;
    readonly trackByItem = trackByItem;
}
