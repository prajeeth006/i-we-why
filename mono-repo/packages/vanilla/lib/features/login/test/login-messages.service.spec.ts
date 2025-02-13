import { TestBed } from '@angular/core/testing';

import { ContentItem, MessageLifetime, MessageScope, MessageType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Subject } from 'rxjs';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { LoginMessagesService } from '../src/login-messages.service';
import { LoginContentMock } from './login.mocks';

describe('LoginMessagesService', () => {
    let service: LoginMessagesService;
    let dslService: DslServiceMock;
    let loginContent: LoginContentMock;
    let messageQueue: MessageQueueServiceMock;
    let dslContentSubject: Subject<ContentItem[]>;
    let trackingService: TrackingServiceMock;

    const entryMessageContent = {
        text: '<p>To view this page you need to log into your account.</p>',
        name: 'otherMessage',
        templateName: 'pctext',
        parameters: {},
    } as ContentItem;
    const defaultEntryMessageContent = {
        text: '<p>To view this page you need to log into your account.</p>',
        name: 'default',
        templateName: 'pctext',
    } as ContentItem;

    beforeEach(() => {
        dslService = MockContext.useMock(DslServiceMock);
        loginContent = MockContext.useMock(LoginContentMock);
        messageQueue = MockContext.useMock(MessageQueueServiceMock);
        trackingService = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [LoginMessagesService, MockContext.providers],
        });

        dslContentSubject = new Subject<ContentItem[]>();
        dslService.evaluateContent.and.returnValue(dslContentSubject);

        loginContent.loginMessages = [entryMessageContent];

        service = TestBed.inject(LoginMessagesService);
    });

    it('should clear messages before setting new ones', () => {
        service.evaluateUrlAndAddMessage();
        dslContentSubject.next([]);

        expect(messageQueue.clear).toHaveBeenCalledWith({ clearPersistent: true, scope: MessageScope.LoginMessages });
    });

    it('should add specific entry message over default one when found', () => {
        service.evaluateUrlAndAddMessage();
        dslContentSubject.next([entryMessageContent, defaultEntryMessageContent]);

        expect(messageQueue.addMultiple).toHaveBeenCalledWith([
            {
                html: entryMessageContent.text,
                type: MessageType.Information,
                lifetime: MessageLifetime.Single,
                scope: MessageScope.LoginMessages,
                name: 'otherMessage',
            },
        ]);
    });

    it('should add message from url evaluation', () => {
        service.evaluateUrlAndAddMessage();
        dslContentSubject.next([entryMessageContent]);

        expect(messageQueue.addMultiple).toHaveBeenCalledWith([
            {
                html: entryMessageContent.text,
                type: MessageType.Information,
                lifetime: MessageLifetime.Single,
                scope: MessageScope.LoginMessages,
                name: 'otherMessage',
            },
        ]);
    });

    it('should add title when available', () => {
        const content = Object.assign({}, entryMessageContent);
        content.title = 'some title';

        service.evaluateUrlAndAddMessage();
        dslContentSubject.next([content]);

        expect(messageQueue.addMultiple).toHaveBeenCalledWith([
            {
                html: `<div class="title">${content.title}</div>${content.text}`,
                type: MessageType.Information,
                lifetime: MessageLifetime.Single,
                scope: MessageScope.LoginMessages,
                name: 'otherMessage',
            },
        ]);
    });

    it('should set message type from content item parameters["message-type"]', () => {
        const content = Object.assign({}, entryMessageContent);
        content.parameters = { 'message-type': 'Warning' };

        service.evaluateUrlAndAddMessage();
        dslContentSubject.next([content]);

        expect(messageQueue.addMultiple).toHaveBeenCalledWith([
            {
                html: content.text,
                type: content.parameters['message-type'],
                lifetime: MessageLifetime.Single,
                scope: MessageScope.LoginMessages,
                name: 'otherMessage',
            },
        ]);
    });

    it('should add message manually', () => {
        service.setLoginMessage('otherMessage');
        dslContentSubject.next([entryMessageContent]);

        expect(messageQueue.addMultiple).toHaveBeenCalledWith([
            {
                html: entryMessageContent.text,
                type: MessageType.Information,
                lifetime: MessageLifetime.Single,
                scope: MessageScope.LoginMessages,
                name: 'otherMessage',
            },
        ]);
    });

    it('should call content item tracking event', () => {
        service.evaluateUrlAndAddMessage();
        dslContentSubject.next([entryMessageContent]);

        expect(trackingService.trackContentItemEvent).toHaveBeenCalledWith(entryMessageContent.parameters, 'tracking.LoadedEvent');
    });
});
