import { Injectable } from '@angular/core';

import {
    ContentItem,
    DslService,
    Message,
    MessageLifetime,
    MessageQueueService,
    MessageScope,
    MessageType,
    ProxyItemForClient,
    ProxyRuleForClient,
    TrackingService,
} from '@frontend/vanilla/core';
import { isEqual } from 'lodash-es';
import { Subject, first, firstValueFrom } from 'rxjs';

import { LoginContent } from './login-content.client-config';

@Injectable({ providedIn: 'root' })
export class LoginMessagesService {
    readonly messagesLoaded = new Subject<Message[]>();

    private current: Message[] = [];
    private item: ContentItem | undefined;

    constructor(
        private dsl: DslService,
        private content: LoginContent,
        private messageQueue: MessageQueueService,
        private trackingService: TrackingService,
    ) {}

    evaluateUrlAndAddMessage() {
        this.dsl
            .evaluateContent(this.content.loginMessages)
            .pipe(first())
            .subscribe((content: (ContentItem | ProxyItemForClient)[]) => {
                const items = content.filter((item: ContentItem | ProxyItemForClient) => this.isContentItem(item));
                this.addMessage(items);
            });
    }

    async setLoginMessage(itemName?: string) {
        if (!itemName) {
            return;
        }

        // check if name of simple content item equals provided name. If yes, just add it as message.
        let item = this.content.loginMessages.find(
            (item: ContentItem | ProxyItemForClient) => this.isContentItem(item) && item.name?.toUpperCase() === itemName.toUpperCase(),
        ) as ContentItem | undefined;

        if (item) {
            this.addMessage([item]);
        } else {
            // fetch all proxy rules where name equals provided name
            const proxyRules = this.content.loginMessages
                .filter((item: ContentItem | ProxyItemForClient): item is ProxyItemForClient => this.isProxyItem(item))
                .flatMap((item: ProxyItemForClient) => item.rules)
                .filter((rule: ProxyRuleForClient) => rule.document?.name?.toUpperCase() === itemName.toUpperCase());

            if (proxyRules && proxyRules.length > 0) {
                for (const rule of proxyRules) {
                    // if condition evaluate to true add document as message
                    if (rule.condition) {
                        const result = await firstValueFrom(this.dsl.evaluateExpression(rule.condition));
                        if (result) {
                            item = rule.document;
                        }
                    } else {
                        // if condition is missing, add document as message because probably proxy rule is set to ALWAYS
                        item = rule.document;
                    }

                    if (item) {
                        break;
                    }
                }
                // if after evaluation there is no item that meets condition, add first item from proxyRules
                if (!item) {
                    item = proxyRules[0]?.document;
                }
                if (item) {
                    this.addMessage([item]);
                }
            }
        }
    }

    private isContentItem(item: ContentItem | ProxyItemForClient): item is ContentItem {
        return 'templateName' in item;
    }

    private isProxyItem(item: ContentItem | ProxyItemForClient): item is ProxyItemForClient {
        return 'isProxy' in item;
    }

    private addMessage(content: ContentItem[]) {
        let messages: Message[] = [];
        this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.LoginMessages });

        if (content?.length > 0) {
            const entryMessageItem = content.find((item: ContentItem) => item.name.toUpperCase() !== 'DEFAULT');

            // Default restricted page item contains filter = Request.Query.Contains("rurlauth=1") AND Request.Query.Contains("rurl=")
            const defaultRestrictedPageItem = content.find((item: ContentItem) => item.name.toUpperCase() === 'DEFAULT');

            if (!entryMessageItem && !defaultRestrictedPageItem) {
                this.messagesLoaded.next([]);
                return;
            }

            this.item = entryMessageItem || defaultRestrictedPageItem;

            messages = [this.createMessage(this.item)!];
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
            name: content.name,
            type: type || (content.parameters && (content.parameters['message-type'] as MessageType)) || MessageType.Information,
            lifetime: MessageLifetime.Single,
            scope: MessageScope.LoginMessages,
        };
    }
}
