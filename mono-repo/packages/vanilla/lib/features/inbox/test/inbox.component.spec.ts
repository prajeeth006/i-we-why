import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeEventType, UtilsService, ViewTemplateForClient, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { BehaviorSubject, of } from 'rxjs';

import { TimerServiceMock } from '../../../core/src/browser/timer.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { InboxComponent } from '../src/components/inbox.component';
import { CtaActionType, InboxMessageActionType } from '../src/inbox.models';
import { InboxMessage, MessageStatus } from '../src/services/inbox.models';
import { InboxConfigMock } from './inbox.client-config.mock';
import { InboxCoreServiceMock } from './inbox.mock';
import { CrappyInboxServiceMock, InboxCountServiceMock, InboxDataServiceMock, InboxTrackingServiceMock } from './inbox.mocks';

describe('InboxComponent', () => {
    let fixture: ComponentFixture<InboxComponent>;
    let component: InboxComponent;
    let crappyInboxServiceMock: CrappyInboxServiceMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let observableMediaMock: MediaQueryServiceMock;
    let trackingService: InboxTrackingServiceMock;
    let inboxServiceMock: InboxCoreServiceMock;
    let inboxDataServiceMock: InboxDataServiceMock;
    let showBackButton: boolean;
    let nativeApplication: NativeAppServiceMock;
    let pageMock: PageMock;
    let inboxConfigMock: InboxConfigMock;

    beforeEach(() => {
        crappyInboxServiceMock = MockContext.useMock(CrappyInboxServiceMock);
        inboxServiceMock = MockContext.useMock(InboxCoreServiceMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        trackingService = MockContext.useMock(InboxTrackingServiceMock);
        inboxDataServiceMock = MockContext.useMock(InboxDataServiceMock);
        nativeApplication = MockContext.useMock(NativeAppServiceMock);
        inboxConfigMock = MockContext.useMock(InboxConfigMock);
        observableMediaMock = MockContext.useMock(MediaQueryServiceMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(InboxCountServiceMock);
        MockContext.useMock(TimerServiceMock);

        TestBed.overrideComponent(InboxComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers, UtilsService],
            },
        });
        crappyInboxServiceMock.messages = new BehaviorSubject<InboxMessage[]>([]);
        crappyInboxServiceMock.updateStatus.and.returnValue(of({ isUpdated: true }));
        crappyInboxServiceMock.remove.and.returnValue(of({ isUpdated: true }));
        showBackButton = false;
        pageMock.product = 'testweb';

        TestBed.inject(WINDOW);
    });

    function setupComponent() {
        fixture = TestBed.createComponent(InboxComponent);
        component = fixture.componentInstance;

        component.backButton = showBackButton;
    }

    function init() {
        const messagesMock = getMessagesMock();

        setupComponent();
        fixture.detectChanges();
        inboxConfigMock.whenReady.next();

        inboxDataServiceMock.getContent.next(<any>{
            messages: {
                DeleteButton: 'delete',
            },
        });

        crappyInboxServiceMock.messages.next(messagesMock);

        messageQueueServiceMock.clear.calls.reset();
    }

    function getMessagesMock() {
        const msg1 = new InboxMessage();
        msg1.selected = false;
        msg1.id = '1';
        const msg2 = new InboxMessage();
        msg2.selected = true;
        msg2.id = '2';
        const msg3 = new InboxMessage();
        msg3.selected = true;
        msg3.id = '3';
        return [msg1, msg2, msg3];
    }

    describe('ngOnInit', () => {
        it('should call subscribe to overlay content', () => {
            setupComponent();
            fixture.detectChanges();
            inboxConfigMock.whenReady.next();
            const overlay: ViewTemplateForClient = <any>{
                text: 'aa',
            };

            inboxDataServiceMock.getContent.next(overlay);

            expect(component.content).toBe(overlay);
            expect(inboxServiceMock.setState).toHaveBeenCalledOnceWith({ isOpen: true });
        });

        it('should set notification banner', () => {
            nativeApplication.isNative = true;
            setupComponent();
            fixture.detectChanges();
            inboxConfigMock.whenReady.next();

            nativeApplication.eventsFromNative.next({
                eventName: 'enableOSPrimer',
                parameters: {
                    displayOSPrimer: 'test',
                },
            });

            expect(component.showNotificationBanner).toBeFalse();

            nativeApplication.eventsFromNative.next({
                eventName: 'enableOSPrimer',
                parameters: {
                    displayOSPrimer: 'Yes',
                },
            });

            expect(component.showNotificationBanner).toBeTrue();
        });
    });

    it('should call inboxService.remove on removeList', () => {
        init();
        component.removeList();
        const selectedMessages = component.messages.filter((m: InboxMessage) => {
            return m.selected;
        });
        const selectedMessagesId = selectedMessages.map((item: InboxMessage) => {
            return item.id;
        });

        expect(crappyInboxServiceMock.remove).toHaveBeenCalledWith(selectedMessagesId);
        expect(trackingService.trackMessageDeleted).toHaveBeenCalledWith(selectedMessagesId.length);
    });

    it('should set messages selected on toggleAll', () => {
        init();
        component.messages = getMessagesMock();
        component.isAllCheckBoxesSelected = true;
        component.toggleAll();

        component.messages.forEach((msg) => {
            expect(msg.selected).toEqual(component.isAllCheckBoxesSelected);
        });

        component.isAllCheckBoxesSelected = false;
        component.toggleAll();

        component.messages.forEach((msg) => {
            expect(msg.selected).toEqual(component.isAllCheckBoxesSelected);
        });
    });

    it('should close and clear messages on hide', () => {
        init();

        component.hide();

        expect(component.isDetailsVisible).toEqual(false);
        expect(inboxServiceMock.close).toHaveBeenCalledWith('close');
        expect(messageQueueServiceMock.clear).toHaveBeenCalled();
        expect(trackingService.trackInboxClosed).toHaveBeenCalledWith(component.selectedMessage);
        expect(nativeApplication.sendToNative).toHaveBeenCalledWith({
            eventName: NativeEventType.INBOXCLOSED,
            parameters: { product: 'testweb' },
        });
    });

    it('should closeMessageDetails on back when the details are shown', () => {
        init();
        component.isDetailsVisible = true;
        observableMediaMock.isActive.withArgs('xs').and.returnValue(true);

        component.back();

        expect(component.isDetailsVisible).toEqual(false);
        expect(component.selectedMessage).toBeUndefined();
        expect(inboxServiceMock.close).not.toHaveBeenCalled();
        expect(messageQueueServiceMock.clear).not.toHaveBeenCalled();
    });

    it('should hide inbox on back when inbox is call from account menu on mobile device', () => {
        showBackButton = true;
        observableMediaMock.isActive.withArgs('xs').and.returnValue(true);
        init();

        component.back();

        expect(component.isDetailsVisible).toEqual(false);
        expect(component.selectedMessage).toBeUndefined();
        expect(inboxServiceMock.close).toHaveBeenCalledWith('back');
        expect(messageQueueServiceMock.clear).toHaveBeenCalled();
    });

    it('should returns footerVisibility value results on footerVisible()', () => {
        init();

        expect(component.footerVisible).toEqual(true);

        component.messages.forEach((msg) => {
            msg.selected = false;
        });

        // on no message selected
        expect(component.footerVisible).toEqual(false);

        // on wait = true
        component.wait = true;

        expect(component.footerVisible).toEqual(false);
    });

    it('should hide on inboxDetailsActions', () => {
        init();
        spyOn(component, 'hide');

        component.inboxDetailsActions({
            type: CtaActionType.HideInbox,
        });

        expect(component.hide).toHaveBeenCalled();
    });

    it('should update allMessagesSelected and hide message on inboxListCallback messageSelected', () => {
        init();

        component.messages[0]!.selected = false;
        component.messages[1]!.selected = true;
        component.inboxListCallback({ type: InboxMessageActionType.MessageSelected });

        expect(component.isAllCheckBoxesSelected).toEqual(false);

        //set all messages selected
        component.messages.forEach((msg) => {
            msg.selected = true;
        });
        component.inboxListCallback({ type: InboxMessageActionType.MessageSelected });

        expect(component.isAllCheckBoxesSelected).toEqual(true);
    });

    it('should change selected message on inboxListCallback messageClicked', () => {
        init();
        const value = new InboxMessage();
        value.id = '1';
        value.isNew = true;

        component.inboxListCallback({ type: InboxMessageActionType.MessageClicked, value });

        expect(component.selectedMessage).toEqual(value);
        expect(component.isDetailsVisible).toEqual(true);
        expect(component.selectedMessage?.messageStatus).toEqual(MessageStatus.read);
        expect(crappyInboxServiceMock.updateStatus).toHaveBeenCalledWith([component.selectedMessage?.id], MessageStatus.read);
    });

    it('should loadMessages on inboxListCallback loadMoreMessages', () => {
        init();

        component.inboxListCallback({ type: InboxMessageActionType.LoadMoreMessages });

        expect(crappyInboxServiceMock.getMessages).toHaveBeenCalled();
    });

    it('should show back button on mobile device when it is called from account menu', () => {
        showBackButton = true;
        init();
        expect(component.showBackButton).toBeTrue();
    });

    it('should toggle showNotification banner', () => {
        init();
        component.notificationsTurnedOn();

        expect(component.showNotificationBanner).toBeFalse();
    });
});
