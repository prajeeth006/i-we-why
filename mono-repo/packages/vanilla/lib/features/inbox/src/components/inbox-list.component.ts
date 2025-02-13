import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageScope, ViewTemplateForClient, trackByProp } from '@frontend/vanilla/core';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { InboxAction, InboxMessageActionType } from '../inbox.models';
import { InboxMessage, MessageStatus } from '../services/inbox.models';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, TrustAsHtmlPipe, MessagePanelComponent, ImageComponent],
    selector: 'lh-inbox-list',
    templateUrl: 'inbox-list.component.html',
})
export class InboxListComponent implements OnChanges {
    @Output() action: EventEmitter<InboxAction> = new EventEmitter();
    @Input() messages: InboxMessage[];
    @Input() content: ViewTemplateForClient;
    @Input() selectedMessage: InboxMessage | null = null;

    readonly MessageStatus = MessageStatus;
    readonly MessageScope = MessageScope;
    readonly trackByOfferId = trackByProp<InboxMessage>('offerId');

    wait: boolean;
    isDetailsVisible: boolean;
    messagesDisplayed: InboxMessage[];

    ngOnChanges(changes: SimpleChanges) {
        if (changes.messages?.currentValue) {
            this.messagesDisplayed = this.messages;
        }
    }

    selectMessage() {
        this.action.emit({
            type: InboxMessageActionType.MessageSelected,
        });
    }

    open(message: InboxMessage) {
        this.action.emit({
            type: InboxMessageActionType.MessageClicked,
            value: message,
        });
    }
}
