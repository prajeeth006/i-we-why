import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ContentItem, HtmlNode, MenuActionOrigin, MenuActionsService, toBoolean } from '@frontend/vanilla/core';
import { PageMatrixComponent } from '@frontend/vanilla/features/content';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { ContentMessagesTrackingService } from './content-messages-tracking.service';

export interface ContentMessageCloseEvent {
    message: ContentItem;
    showOnNextSession?: boolean;
    showOnNextLogin?: boolean;
}

@Component({
    standalone: true,
    imports: [CommonModule, PageMatrixComponent, IconCustomComponent],
    selector: 'vn-content-message',
    templateUrl: 'content-message.html',
})
export class ContentMessageComponent implements OnInit, OnDestroy {
    @Input() message: ContentItem;
    @Input() scope: string;
    @Output() close: EventEmitter<ContentMessageCloseEvent> = new EventEmitter();
    iconClass: string;

    constructor(
        private htmlNode: HtmlNode,
        private contentMessagesTrackingService: ContentMessagesTrackingService,
        private menuActionService: MenuActionsService,
    ) {}

    ngOnInit() {
        this.setHtmlCssClass(true);
        this.contentMessagesTrackingService.trackMessageLoaded(this.message, this.scope);
        this.iconClass = this.message.parameters?.closeIcon || 'theme-close-i';
    }

    ngOnDestroy() {
        this.setHtmlCssClass(false);
    }

    onClick() {
        if (toBoolean(this.message.parameters?.closeOnMessageClick)) {
            this.close.next({ message: this.message });
        }
    }

    closeMessage(showOnNextSession: boolean = false, showOnNextLogin: boolean = false) {
        this.close.next({ message: this.message, showOnNextSession, showOnNextLogin });

        if (this.message.parameters?.closeAction) {
            this.menuActionService.invoke(this.message.parameters.closeAction, MenuActionOrigin.PageMatrix, [this.message.parameters.queryStringKey]);
        }
    }

    private setHtmlCssClass(add: boolean) {
        if (this.message.parameters?.htmlTagClass) {
            this.htmlNode.setCssClass(this.message.parameters.htmlTagClass, add);
        }
    }
}
