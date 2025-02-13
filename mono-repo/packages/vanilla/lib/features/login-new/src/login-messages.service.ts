import { Injectable } from '@angular/core';

import { ContentItem, DslService, Message, MessageLifetime, MessageQueueService, MessageType, TrackingService } from '@frontend/vanilla/core';
import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';

import { LoginConfig } from './login.client-config';

@Injectable({ providedIn: 'root' })
export class LoginMessagesService {
    scope = 'login-messages';

    readonly messagesLoaded: Subject<Message[]>;
    private current: Message[] = [];
    private item: ContentItem | undefined;

    constructor(
        private dsl: DslService,
        private loginConfig: LoginConfig,
        private messageQueue: MessageQueueService,
        private trackingService: TrackingService,
    ) {
        this.messagesLoaded = new Subject<Message[]>();
    }

    evaluateUrlAndAddMessage() {
        this.dsl.evaluateContent(this.loginConfig.loginMessages).subscribe((content) => {
            this.addMessage(content);
        });
    }

    setLoginMessage(itemName: string) {
        if (itemName) {
            const item = this.loginConfig.loginMessages?.find((item: ContentItem) => item.name.toUpperCase() === itemName.toUpperCase());

            if (item) {
                this.addMessage([item]);
            }
        }
    }

    private addMessage(content: ContentItem[]): any {
        let messages: Message[] = [];
        this.messageQueue.clear({ clearPersistent: true, scope: this.scope });

        if (content && content.length > 0) {
            const entryMessageItem = content.find((item) => item.name.toUpperCase() !== 'DEFAULT');
            // Default restricted page item contains filter = Request.Query.Contains("rurlauth=1") AND Request.Query.Contains("rurl=")
            const defaultRestrictedPageItem = content.find((item) => item.name.toUpperCase() === 'DEFAULT');

            if (!entryMessageItem && !defaultRestrictedPageItem) {
                this.messagesLoaded.next([]);
            } else {
                this.item = entryMessageItem || defaultRestrictedPageItem;
                messages = [this.createMessage(this.item)!];
            }
        } else {
            this.messagesLoaded.next([]);
            return;
        }

        if (!isEqual(this.current, messages)) {
            this.current = messages;
            this.messagesLoaded.next(messages);
            this.trackingService.trackContentItemEvent(this.item?.parameters || {}, 'tracking.LoadedEvent');
        }

        this.messageQueue.addMultiple(messages);
    }

    private createMessage(content: ContentItem | undefined, type?: MessageType): Message | null {
        if (!content) {
            return null;
        }

        const title = content.title ? `<div class="title">${content.title}</div>` : '';

        return {
            html: `${title}${content.text}`,
            type: type || (content.parameters && (content.parameters['message-type'] as MessageType)) || MessageType.Information,
            lifetime: MessageLifetime.Single,
            scope: this.scope,
        };
    }
}
