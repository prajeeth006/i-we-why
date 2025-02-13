import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Message } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { messagesInterceptor } from '../../src/messages/messages.interceptor';
import { MessageQueueServiceMock } from './message-queue.mock';

describe('MessagesInterceptor', () => {
    let messageQueueServiceMock: MessageQueueServiceMock;
    let request: HttpRequest<any>;
    let messages: any;
    let body: any;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([messagesInterceptor])), provideHttpClientTesting()],
        });

        request = new HttpRequest('GET', 'url', {});

        messages = [{ html: 'xxx' }];
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    const scenarios = [{ description: 'scenario without scope:' }, { description: 'scenario with scope:', scope: 'myscope' }];

    scenarios.forEach((scenario) => {
        const scopedMessages = [{ html: 'xxx', scope: scenario.scope || '' }];

        describe(scenario.description, () => {
            it('should add messages to message queue (success)', () => {
                setMessages(scopedMessages);

                intercept(scenario.scope);

                expect(messageQueueServiceMock.clear).toHaveBeenCalled();
                expect(messageQueueServiceMock.addMultiple).toHaveBeenCalledWith(scopedMessages);
            });

            it('should add messages to message queue (error)', () => {
                setMessages(scopedMessages);

                interceptError(scenario.scope);

                expect(messageQueueServiceMock.clear).toHaveBeenCalledWith();
                expect(messageQueueServiceMock.addMultiple).toHaveBeenCalledWith(scopedMessages);
            });
        });
    });

    it('should add messages to message queue with server side scope', () => {
        const serverScopedMessages = [{ html: 'xxx', scope: 'server_scope' }];
        setMessages(serverScopedMessages);

        intercept();

        expect(messageQueueServiceMock.clear).toHaveBeenCalledWith();
        expect(messageQueueServiceMock.addMultiple).toHaveBeenCalledWith(serverScopedMessages);
    });

    it('should add messages to message queue with client side scope over server side scope', () => {
        const serverScopedMessages = [{ html: 'xxx', scope: 'server_scope' }];
        setMessages(serverScopedMessages);

        intercept('client_scope');

        expect(messageQueueServiceMock.clear).toHaveBeenCalledWith();
        expect(messageQueueServiceMock.addMultiple).toHaveBeenCalledWith([{ html: 'xxx', scope: 'client_scope' }]);
    });

    it('should not intercept responses for /api/clientconfig', () => {
        request = new HttpRequest('GET', 'en/api/clientconfig', {});
        setMessages(messages);

        intercept();

        expect(messageQueueServiceMock.clear).not.toHaveBeenCalled();
        expect(messageQueueServiceMock.addMultiple).not.toHaveBeenCalled();
    });

    it('should add not do anything if there are no messages', () => {
        setMessages(null);
        intercept();

        expect(messageQueueServiceMock.clear).not.toHaveBeenCalled();
        expect(messageQueueServiceMock.addMultiple).not.toHaveBeenCalled();
    });

    it('should add not do anything if there body is null', () => {
        intercept(undefined, false);

        expect(messageQueueServiceMock.clear).not.toHaveBeenCalled();
        expect(messageQueueServiceMock.addMultiple).not.toHaveBeenCalled();
    });

    function setMessages(messages: Partial<Message>[] | null, isBody: boolean = true) {
        if (isBody) body = { vnMessages: messages };
    }

    function intercept(scope: string = '', isBody: boolean = true) {
        if (scope) {
            const headers = request.headers.append('X-van-message-queue-scope', scope);
            request = request.clone({ headers });
        }

        client.request(request).subscribe();
        const req = controller.expectOne((req) => req.url.indexOf('url') > -1 || req.url.indexOf('en/api/clientconfig') > -1);
        req.flush(isBody ? body : null);
    }

    function interceptError(scope: string = '') {
        if (scope) {
            const headers = request.headers.append('X-van-message-queue-scope', scope);
            request = request.clone({ headers });
        }

        client.request(request).subscribe();
        const req = controller.expectOne('url');
        req.flush(body, { status: 0, statusText: 'ERROR' });
    }
});
