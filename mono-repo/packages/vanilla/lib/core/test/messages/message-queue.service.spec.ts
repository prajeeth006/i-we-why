import { TestBed } from '@angular/core/testing';

import { Message, MessageLifetime, MessageQueueService, MessageScope, MessageType, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SessionStoreServiceMock } from '../../src/browser/store/test/session-store.mock';

describe('MessageQueueService', () => {
    let service: MessageQueueService;
    let sessionStoreServiceMock: SessionStoreServiceMock;

    const testMessage: Message = { html: 'message', type: MessageType.Error, lifetime: MessageLifetime.Single };

    beforeEach(() => {
        sessionStoreServiceMock = MockContext.useMock(SessionStoreServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MessageQueueService],
        });

        TestBed.inject(WINDOW);
        service = TestBed.inject(MessageQueueService);
    });

    const scenarios = [
        { description: 'scenario without scope:', scope: undefined },
        { description: 'scenario with scope:', scope: 'myscope' },
    ];

    scenarios.forEach((scenario) => {
        const scopedTestMessage: Message = { ...testMessage, scope: scenario.scope };

        describe(scenario.description, () => {
            describe('addMessage()', () => {
                it('should add message to queue', () => {
                    service.add(testMessage.html, testMessage.type, testMessage.lifetime, scenario.scope);

                    expect(service.messages().length).toBe(1);
                    expectMessage(scopedTestMessage);
                });

                it('should add message specified as object to queue', () => {
                    service.add(scopedTestMessage);

                    expect(service.messages().length).toBe(1);
                    expectMessage(scopedTestMessage);
                });

                it('should throw if adding empty message', () => {
                    const msg: string | null = null;

                    expect(() => service.add(msg!, MessageType.Error, MessageLifetime.Single, scenario.scope)).toThrowError();

                    expect(service.messages().length).toBe(0);
                });

                it('should have a default type and lifetime', () => {
                    service.add(testMessage.html, undefined, undefined, scenario.scope);

                    expectMessage({
                        html: testMessage.html,
                        type: MessageType.Default,
                        lifetime: MessageLifetime.Single,
                        scope: scenario.scope,
                    });
                });
            });

            describe('addError()', () => {
                it('should add message with type error', () => {
                    service.addError(testMessage.html, testMessage.lifetime, scenario.scope);

                    expectMessage({
                        html: testMessage.html,
                        type: MessageType.Error,
                        lifetime: MessageLifetime.Single,
                        scope: scenario.scope,
                    });
                });
            });

            describe('addInfo()', () => {
                it('should add message with type info', () => {
                    service.addInfo(testMessage.html, MessageLifetime.TempData, scenario.scope);

                    expectMessage({
                        html: testMessage.html,
                        type: MessageType.Information,
                        lifetime: MessageLifetime.TempData,
                        scope: scenario.scope,
                    });
                });
            });

            describe('addSuccess()', () => {
                it('should add message with type success', () => {
                    service.addSuccess(testMessage.html, undefined, scenario.scope);

                    expectMessage({
                        html: testMessage.html,
                        type: MessageType.Success,
                        lifetime: MessageLifetime.Single,
                        scope: scenario.scope,
                    });
                });
            });

            describe('addMultiple()', () => {
                it('should throw if adding undefined', () => {
                    const msgs: Message[] | null = null;

                    expect(() => service.addMultiple(msgs!)).toThrowError();

                    expect(service.messages().length).toBe(0);
                });

                it('should add multiple messages', () => {
                    service.addMultiple([
                        scopedTestMessage,
                        {
                            html: 'message2',
                            type: MessageType.Success,
                            lifetime: MessageLifetime.TempData,
                            scope: scenario.scope,
                        },
                    ]);

                    expectMessage(scopedTestMessage);
                    expectMessage(
                        {
                            html: 'message2',
                            type: MessageType.Success,
                            lifetime: MessageLifetime.TempData,
                            scope: scenario.scope,
                        },
                        1,
                    );
                });
            });

            describe('count()', () => {
                it('should return count of all messages when param scope is omitted', () => {
                    service.add(testMessage);
                    service.add(scopedTestMessage);
                    service.add({ ...testMessage, scope: 'otherscope' });

                    expect(service.count()).withContext('unexpected total number of messages').toBe(3);
                });

                it('should return count of messages with matching scope', () => {
                    service.add({ ...testMessage, scope: 'otherscope' });
                    const scope = scenario.scope || '';
                    expect(service.count(scope)).toBe(0);

                    service.add(scopedTestMessage);
                    expect(service.count(scope)).toBe(1);

                    service.add(scopedTestMessage);
                    expect(service.count(scope)).toBe(2);

                    service.clear();
                    expect(service.count(scenario.scope)).toBe(0);
                });
            });

            describe('clear()', () => {
                it('should remove Single messages', () => {
                    service.add(scopedTestMessage);
                    service.add(scopedTestMessage);

                    service.clear();

                    expect(service.messages().length).toBe(0);
                });

                it('should touch TempData messages with matching scope', () => {
                    service.add({
                        html: 'msg',
                        type: MessageType.Error,
                        lifetime: MessageLifetime.TempData,
                        scope: scenario.scope,
                    });

                    service.clear({ clearPersistent: false, ...(scenario.scope ? { scope: scenario.scope } : {}) });

                    expect(service.messages().length).toBe(1);
                    expectMessage({
                        html: 'msg',
                        type: MessageType.Error,
                        lifetime: MessageLifetime.Single,
                        scope: scenario.scope,
                    });

                    service.clear();
                    expect(service.messages().length).toBe(0);
                });

                it('should remove TempData messages with matching scope if clearPersistent is specified', () => {
                    service.add({
                        html: 'msg',
                        type: MessageType.Error,
                        lifetime: MessageLifetime.TempData,
                        scope: scenario.scope,
                        name: 'test',
                    });

                    service.clear({ clearPersistent: true, ...(scenario.scope ? { scope: scenario.scope } : {}) });

                    expect(service.messages().length).toBe(0);
                });

                it('should remove messages from Session Storage if clearStoredMessages is specified', () => {
                    service.add({
                        html: 'msg',
                        type: MessageType.Error,
                        lifetime: MessageLifetime.TempData,
                        scope: scenario.scope,
                        name: 'test',
                    });

                    service.clear({ clearPersistent: true, clearStoredMessages: true });

                    expect(service.messages().length).toBe(0);
                    expect(sessionStoreServiceMock.remove).toHaveBeenCalled();
                });
            });
        });
    });

    describe('changeScope()', () => {
        it('should change scope', () => {
            service.addMultiple([
                { html: 'message1', type: MessageType.Success, lifetime: MessageLifetime.TempData },
                {
                    html: 'message2',
                    type: MessageType.Success,
                    lifetime: MessageLifetime.TempData,
                    scope: 'test scope',
                },
                { html: 'message3', type: MessageType.Success, lifetime: MessageLifetime.TempData, scope: 'test' },
            ]);

            service.changeScope('test scope', 'login');

            expectMessage({ html: 'message1', type: MessageType.Success, lifetime: MessageLifetime.TempData }, 0);
            expectMessage(
                {
                    html: 'message2',
                    type: MessageType.Success,
                    lifetime: MessageLifetime.TempData,
                    scope: MessageScope.Login,
                },
                1,
            );
            expectMessage(
                {
                    html: 'message3',
                    type: MessageType.Success,
                    lifetime: MessageLifetime.TempData,
                    scope: 'test',
                },
                2,
            );
        });
    });

    describe('remove()', () => {
        it('should remove specified message', () => {
            service.add(testMessage);
            service.remove(testMessage);

            expect(service.messages().length).toBe(0);
        });

        it('should remove added message', () => {
            service.add(testMessage);
            const msg = service.add('msg');
            service.remove(msg);

            expect(service.messages().length).toBe(1);
        });

        it('should remove messages by predicate', () => {
            service.add(testMessage);
            service.add(testMessage);
            service.add('msg', MessageType.Success);

            service.remove((m) => m.type == 'Success');

            expect(service.messages().length).toBe(2);
        });
    });

    describe('storeMessages()', () => {
        it('should store current messages to sessionStorage', () => {
            service.add(testMessage);

            service.storeMessages();

            expect(sessionStoreServiceMock.set).toHaveBeenCalledWith('message-queue', service.messages());
        });

        it('should touch TempData messages before storing to sessionStorage', () => {
            service.add({ html: 'msg', type: MessageType.Error, lifetime: MessageLifetime.TempData });

            service.storeMessages();

            expect(sessionStoreServiceMock.set).toHaveBeenCalledWith('message-queue', [
                { html: 'msg', type: 'Error', lifetime: 'Single', scope: '' },
            ]);
        });
    });

    describe('restoreMessages()', () => {
        it('should append messages from sessionStorage', () => {
            sessionStoreServiceMock.set('message-queue', [testMessage]);

            service.restoreMessages();

            expect(service.messages().length).toBe(1);
            expectMessage(testMessage);
        });
    });

    function expectMessage(message: Message, index: number = 0) {
        expect(service.messages()[index]?.html).toBe(message.html);
        expect(service.messages()[index]?.type).toBe(message.type);
        expect(service.messages()[index]?.lifetime).toBe(message.lifetime);
        expect(service.messages()[index]?.scope).toBe(message.scope || '');
    }
});
