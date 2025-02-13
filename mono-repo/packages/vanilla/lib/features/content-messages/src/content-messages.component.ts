import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from '@angular/core';

import {
    ContentItem,
    HtmlNode,
    MenuActionOrigin,
    MenuActionsService,
    UserEvent,
    UserLoginEvent,
    UserService,
    toBoolean,
    trackByProp,
} from '@frontend/vanilla/core';
import { filter, first } from 'rxjs/operators';

import { ContentMessageComponent } from './content-message.component';
import { ContentMessagesService } from './content-messages.service';

/**
 * @whatItDoes Renders a collection of content messages
 *
 * @howToUse
 *
 * ```
 * <vn-content-messages [messages]="contentMessages" [dynamicValues]="dynamicContentValues" closedCookieKey="yourKey" />
 * ```
 *
 * @description
 *
 * Renders a collection of content messages. Content for content messages can be loaded with `IContentMessageLoader` on the
 * server, then rendered on the client with client side page matrix.
 *
 * See http://moss.bwin.com/development/contentservices/The%20Brain/Content%20Messages.aspx for more information
 * about content messages.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, ContentMessageComponent],
    selector: 'vn-content-messages',
    templateUrl: 'content-messages.html',
})
export class ContentMessagesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() closedCookieKey: string;
    @Input() cssClassForHtmlNode: string;
    @Input() messages: ContentItem[];
    @Input() dynamicValues?: { Key: ''; Value: '' }[];

    messagesToShow: ContentItem[] = [];
    readonly trackByName = trackByProp<ContentItem>('name');

    constructor(
        private messagesService: ContentMessagesService,
        private menuActionService: MenuActionsService,
        private htmlNode: HtmlNode,
        user: UserService,
        @Optional() private overlayRef: OverlayRef,
    ) {
        user.events
            .pipe(
                filter((e: UserEvent) => e instanceof UserLoginEvent),
                first(),
            )
            .subscribe(() => this.refreshMessagesToShow());
    }

    ngOnInit() {
        if (this.overlayRef) {
            this.overlayRef.backdropClick().subscribe(() => {
                for (const message of this.messagesToShow) {
                    if (toBoolean(message.parameters?.writeCookieOnOverlayClick)) {
                        this.messagesService.markMessageAsClosed(message, this.closedCookieKey);
                    }
                    if (message.parameters?.closeAction) {
                        this.menuActionService.invoke(message.parameters.closeAction, MenuActionOrigin.PageMatrix, [
                            message.parameters.queryStringKey,
                        ]);
                    }
                }

                this.messages = [];
                this.refreshMessagesToShow();
                this.overlayRef.dispose();
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.messages || changes.closedCookieKey || changes.dynamicValues) {
            this.setDynamicContentValues();
            this.refreshMessagesToShow();
        }
    }

    ngOnDestroy() {
        this.toggleClassForHtmlNode(false);
    }

    closeMessage(message: ContentItem, showOnNextSession: boolean = false, showOnNextLogin: boolean = false) {
        const options = {
            showOnNextSession,
            showOnNextLogin,
        };

        if (Object.keys(options).length > 0) {
            this.messagesService.markMessageAsClosed(message, this.closedCookieKey, options);
        } else {
            this.messagesService.markMessageAsClosed(message, this.closedCookieKey);
        }

        this.messages = this.messages.filter((m: ContentItem) => m !== message);
        this.refreshMessagesToShow();

        if (this.overlayRef && !this.messagesToShow.length) {
            // Last message closed -> remove overlay if any
            this.overlayRef.dispose();
        }
    }

    private refreshMessagesToShow() {
        if (this.messages?.length && this.closedCookieKey) {
            const closedMsgNames = new Set(this.messagesService.getClosedMessageNames(this.closedCookieKey).map((v: string) => v.toLowerCase()));
            this.messagesToShow = this.messages.filter((m: ContentItem) => m && !closedMsgNames.has(m.name.toLowerCase()));
        } else {
            this.messagesToShow = [];
        }

        this.toggleClassForHtmlNode(this.messagesToShow.length > 0);
    }

    private toggleClassForHtmlNode(enabled: boolean) {
        this.htmlNode.setCssClass(this.cssClassForHtmlNode, enabled);
    }

    /**
     * @whatItDoes Goes through all visible message parameters and replace placeholders `{EXAMPLE_KEY}`
     * with a value with the same key from `dynamicValues` input.
     * The message will remain unchanged if placeholder does not mach the format
     * or value is not found in the `dynamicValues`.
     */
    private setDynamicContentValues() {
        if (!this.dynamicValues || !this.messages) {
            return;
        }

        this.messages.forEach((message: ContentItem) => {
            for (const param in message.parameters) {
                message.parameters[param] = message.parameters[param]!.replace(/{\w+}/g, (placeholder: string) => {
                    const key = placeholder.replace(/[{}]+/g, '');
                    const value = this.dynamicValues?.find((value) => value.Key === key)?.Value;

                    return value || placeholder;
                });
            }
        });
    }
}
