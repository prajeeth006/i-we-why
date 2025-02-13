import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ContentItem } from '@frontend/vanilla/core';
import { ContentMessagesService, ContentMessagesComponent as PureContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, PureContentMessagesComponent],
    selector: 'vn-am-content-messages',
    templateUrl: 'content-messages.html',
})
export class ContentMessagesComponent extends AccountMenuItemBase implements OnInit {
    messages: ContentItem[] = [];
    closedCookieKey: string | undefined;

    constructor(private contentMessagesService: ContentMessagesService) {
        super();
    }

    ngOnInit(): void {
        if (this.item.parameters['source']) {
            this.closedCookieKey = this.item.parameters['closed-cookie-key'];
            this.contentMessagesService.getMessages('contentMessages').subscribe(
                (
                    messages:
                        | ContentItem[]
                        | {
                              [key: string]: ContentItem[];
                          },
                ) => {
                    const key = this.item.parameters['source']?.toLowerCase();
                    if (key != null && !(messages instanceof Array)) {
                        this.messages = messages[key] || [];
                    }
                },
            );
        }
    }
}
