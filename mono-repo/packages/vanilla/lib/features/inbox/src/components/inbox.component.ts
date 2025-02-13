import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    InboxService,
    MediaQueryService,
    MessageLifetime,
    MessageQueueService,
    MessageScope,
    MessageType,
    NativeAppService,
    NativeEvent,
    NativeEventType,
    Page,
    TimerService,
    UtilsService,
    ViewTemplateForClient,
    WINDOW,
} from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

import { CtaAction, CtaActionType, InboxAction, InboxMessageActionType, InboxMessageUpdateStatusResponse } from '../inbox.models';
import { CrappyInboxService } from '../services/crappy-inbox.service';
import { InboxCountService } from '../services/inbox-count.service';
import { InboxDataService } from '../services/inbox-data.service';
import { InboxTrackingService } from '../services/inbox-tracking.service';
import { InboxConfig } from '../services/inbox.client-config';
import { InboxMessage, MessageStatus, StatusType } from '../services/inbox.models';
import { InboxDetailsComponent } from './inbox-details.component';
import { InboxListComponent } from './inbox-list.component';
import { InboxNotificationBannerComponent } from './inbox-notification-banner.component';
import { OnBottomScrollDirective } from './on-bottom-scroll.directive';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TrustAsHtmlPipe,
        LhHeaderBarComponent,
        InboxListComponent,
        InboxDetailsComponent,
        OnBottomScrollDirective,
        InboxNotificationBannerComponent,
    ],
    selector: 'lh-inbox',
    templateUrl: 'inbox.component.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/inbox/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InboxComponent implements OnInit, OnDestroy {
    @Input() backButton: boolean;

    messages: InboxMessage[];
    selectedMessage: InboxMessage | undefined;
    content: ViewTemplateForClient;
    wait: boolean;
    isAllCheckBoxesSelected: boolean;
    deletedMessagesButton: string;
    isDetailsVisible: boolean = false;
    loadBeforeItems: number;
    isLoading: boolean = false;
    showNotificationBanner: boolean = false;

    private pageIndex: number;
    private pageSize: number;
    // Needed to do this work around because the paging in server side is not done correctly
    private allNewMessagesLoaded = false;
    private isBackButtonVisible: boolean;
    private unsubscribe = new Subject<void>();
    private timeoutId: NodeJS.Timeout;
    readonly #window = inject(WINDOW);

    constructor(
        public nativeApplication: NativeAppService,
        private crappyInboxService: CrappyInboxService,
        private messageQueue: MessageQueueService,
        private inboxConfig: InboxConfig,
        private timerService: TimerService,
        private utils: UtilsService,
        private media: MediaQueryService,
        private tracking: InboxTrackingService,
        private inboxCountService: InboxCountService,
        private inboxDataService: InboxDataService,
        private inboxService: InboxService,
        private page: Page,
    ) {}

    get footerVisible(): boolean {
        if (!this.messages) {
            return false;
        }

        if (this.media.isActive('xs') && this.isDetailsVisible) {
            return false;
        }

        return !this.wait && this.getSelectedMessages().length > 0;
    }

    get showBackButton(): boolean {
        return this.isBackButtonVisible || (this.media.isActive('xs') && this.isDetailsVisible);
    }

    get detailsVisible(): boolean {
        return (this.media.isActive('xs') && this.isDetailsVisible) || !this.media.isActive('xs');
    }

    get listVisible(): boolean {
        return (this.media.isActive('xs') && !this.isDetailsVisible) || !this.media.isActive('xs');
    }

    ngOnInit() {
        this.inboxConfig.whenReady.pipe(first()).subscribe(() => {
            this.loadBeforeItems = this.inboxConfig.lazyLoading.loadBeforeItems;
            this.pageSize = this.getPageSize();

            this.crappyInboxService.messages.pipe(takeUntil(this.unsubscribe)).subscribe((message: InboxMessage[]) => {
                this.messagesLoaded(message);
                this.wait = false;
                this.isLoading = false;
            });

            this.initMessagesList();
            this.isBackButtonVisible = this.backButton;
            this.inboxDataService
                .getContent()
                .pipe(first())
                .subscribe((template: ViewTemplateForClient) => (this.content = template));
            this.wait = true;

            if (this.nativeApplication.isNativeApp) {
                this.messageQueue.clear();
            }

            if (this.nativeApplication.isNative) {
                this.nativeApplication.eventsFromNative
                    .pipe(filter((e: NativeEvent) => e.eventName === NativeEventType.enableOSPrimer))
                    .subscribe((e: NativeEvent) => {
                        this.showNotificationBanner = e.parameters?.displayOSPrimer?.toLowerCase() === 'yes' || false;
                    });
            }

            this.media
                .observe()
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(() => {
                    if (!this.media.isActive('xs')) {
                        this.selectFirstInboxMessage();
                    }
                });

            this.inboxService.setState({ isOpen: true });
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.crappyInboxService.resetMessages();
        this.timerService.clearTimeout(this.timeoutId);
    }

    hide() {
        this.tracking.trackInboxClosed(this.selectedMessage ?? new InboxMessage());
        this.nativeApplication.sendToNative({
            eventName: NativeEventType.INBOXCLOSED,
            parameters: { product: this.page.product },
        });
        this.hideInbox(false);
    }

    back() {
        if (this.isDetailsVisible && this.media.isActive('xs')) {
            this.closeMessageDetails();
        } else if (this.isBackButtonVisible) {
            this.hideInbox(true);
        }
    }

    inboxListCallback(action: InboxAction) {
        switch (action.type) {
            case InboxMessageActionType.MessageSelected:
                this.clearMessageQueue();
                this.setDeleteButtonText();
                this.updateIsAllCheckBoxesSelected();
                break;
            case InboxMessageActionType.MessagesRemoved:
                this.closeMessageDetails();
                if (!this.crappyInboxService.isAllMessagesLoaded) {
                    this.pageIndex++;
                    this.loadMessages();
                }
                this.wait = false;
                break;
            case InboxMessageActionType.MessageClicked:
                this.isDetailsVisible = true;
                this.clearMessageQueue();
                this.setSelectedMessage(action.value);
                break;
            case InboxMessageActionType.LoadMoreMessages:
                this.loadMoreMessages();
                break;
        }
    }

    inboxDetailsActions(action: CtaAction) {
        switch (action.type) {
            case CtaActionType.HideInbox:
                this.hide();
                break;
        }
    }

    removeList() {
        this.wait = true;
        const ids = this.getSelectedMessages().map((item: InboxMessage) => item.id);
        this.removeMessages(ids);
    }

    toggleAll() {
        this.messages.forEach((message: InboxMessage) => {
            message.selected = this.isAllCheckBoxesSelected;
        });
        this.setDeleteButtonText();
    }

    notificationsTurnedOn() {
        this.showNotificationBanner = false;
    }

    loadMoreMessages() {
        if (!this.isLoading && !this.crappyInboxService.isAllMessagesLoaded) {
            this.pageIndex++;
            this.loadMessages();
        }
    }

    private getPageSize(): number {
        return Math.ceil(this.getMinMessagesForScreen() / this.inboxConfig.lazyLoading.pageSize) * this.inboxConfig.lazyLoading.pageSize;
    }

    private getMinMessagesForScreen(): number {
        const minHeightOfOneMessage = 40;

        return this.#window.screen.height / minHeightOfOneMessage;
    }

    private messagesLoaded(msgs: InboxMessage[]) {
        this.messages = msgs;

        if (!this.media.isActive('xs') && this.messages?.length) {
            this.selectedMessage = this.messages[0];
        }

        if (!this.allNewMessagesLoaded) {
            this.setIfAllNewMessagesLoaded();
        }

        this.handleNewMessages();
    }

    private selectFirstInboxMessage() {
        if (!this.selectedMessage && this.messages?.length) {
            this.setSelectedMessage(this.messages[0]);
        }
    }

    private setSelectedMessage(message?: InboxMessage) {
        this.selectedMessage = message;

        if (this.selectedMessage && (this.selectedMessage.isNew || this.selectedMessage.messageStatus === MessageStatus.unread)) {
            this.crappyInboxService
                .updateStatus([this.selectedMessage.id], MessageStatus.read)
                .subscribe((response: InboxMessageUpdateStatusResponse) => {
                    if (response.isUpdated && this.selectedMessage) {
                        this.selectedMessage.messageStatus = MessageStatus.read;
                    }
                });
        }
    }

    private initMessagesList() {
        this.pageIndex = 0;
        this.allNewMessagesLoaded = false;
        this.messages = [];
        this.wait = true;
        this.loadMessages();
    }

    private loadMessages() {
        this.isLoading = true;
        this.clearMessageQueue();
        this.crappyInboxService.getMessages(this.pageIndex, this.pageSize, this.allNewMessagesLoaded ? StatusType.all : StatusType.new).subscribe();
    }

    private handleNewMessages() {
        const newMessages = this.messages.filter((el: InboxMessage) => el.isNew);

        if (newMessages.length > 0) {
            this.updateNewMessagesStatusToUnread(newMessages);
        }
    }

    private setIfAllNewMessagesLoaded() {
        const newMessages = this.messages.filter((el: InboxMessage) => !el.isNew);

        if (newMessages.length > 0) {
            this.allNewMessagesLoaded = true;
            //reset pageindex because now it's a new index for not new messages (workaround for backend responses) :(
            this.pageIndex = 0;
        }
    }

    private updateNewMessagesStatusToUnread(newMessages: InboxMessage[]) {
        const newMessagesIds = newMessages.map((m: InboxMessage) => m.id);

        this.timeoutId = this.timerService.setTimeoutOutsideAngularZone(() => {
            this.crappyInboxService.updateStatus(newMessagesIds, MessageStatus.unread).subscribe((response: InboxMessageUpdateStatusResponse) => {
                if (response.isUpdated) {
                    newMessages.forEach((e: InboxMessage) => {
                        if (e.messageStatus === MessageStatus.new) {
                            e.messageStatus = MessageStatus.unread;
                        }
                        e.isNew = false;
                    });

                    this.inboxCountService.refresh();

                    if (this.selectedMessage) {
                        this.setSelectedMessage(this.selectedMessage);
                    }
                }
            });
        }, this.inboxConfig.readTime);
    }

    private closeMessageDetails() {
        this.isDetailsVisible = false;
        this.selectedMessage = undefined;
    }

    private setDeleteButtonText() {
        if (this.content.messages?.DeleteButton) {
            this.deletedMessagesButton = this.utils.format(this.content.messages.DeleteButton || '', this.getSelectedMessages().length);
        }
    }

    private updateIsAllCheckBoxesSelected() {
        this.isAllCheckBoxesSelected = this.getSelectedMessages().length === this.messages.length;
    }

    private getSelectedMessages(): InboxMessage[] {
        return this.messages.filter((m: InboxMessage) => m.selected);
    }

    private removeMessages(ids: string[]) {
        this.clearMessageQueue();

        this.crappyInboxService.remove(ids).subscribe((response) => {
            if (response?.isUpdated) {
                this.messagesRemovedSuccess(ids);
            }
        });
    }

    private messagesRemovedSuccess(ids: string[]) {
        this.tracking.trackMessageDeleted(ids.length);

        const showMessage = ids.length !== this.messages.length;

        if (showMessage) {
            this.showSuccessMessageRemoved(ids);
        }

        this.closeMessageDetails();
        this.wait = false;
        this.updateIsAllCheckBoxesSelected();

        if (!this.crappyInboxService.isAllMessagesLoaded) {
            this.pageIndex++;
            this.loadMessages();
        }
    }

    private showSuccessMessageRemoved(ids: string[]) {
        if (this.content.messages?.DeleteSuccessOneMessage) {
            const deletedMessagesText =
                ids.length === 1
                    ? this.content.messages.DeleteSuccessOneMessage
                    : this.utils.format(this.content.messages.DeleteSuccessMessage || '', ids.length);

            this.messageQueue.add(deletedMessagesText, MessageType.Success, MessageLifetime.Single, MessageScope.Inbox);
        }

        this.timeoutId = this.timerService.setTimeout(() => this.clearMessageQueue(), 3000);
    }

    private clearMessageQueue() {
        this.messageQueue.clear({ scope: MessageScope.Inbox, clearPersistent: false });
    }

    private hideInbox(back: boolean) {
        this.clearMessageQueue();
        this.inboxService.close(back ? 'back' : 'close');
    }
}
