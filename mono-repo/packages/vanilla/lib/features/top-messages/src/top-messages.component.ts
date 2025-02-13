import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ContentItem } from '@frontend/vanilla/core';
import { ContentMessagesComponent, ContentMessagesService } from '@frontend/vanilla/features/content-messages';
import { DslPipe } from '@frontend/vanilla/shared/browser';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, ContentMessagesComponent],
    selector: 'vn-top-messages',
    templateUrl: 'top-messages.html',
})
export class TopMessagesComponent {
    topMessages: ContentItem[];

    constructor(contentMessagesService: ContentMessagesService) {
        contentMessagesService.getMessages('contentMessages').subscribe((messages) => {
            if (!(messages instanceof Array)) {
                this.topMessages = messages?.['topmessages'] || [];
            }
        });
    }
}
