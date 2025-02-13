import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { RtmsMessage, RtmsType, UserEvent, UserLoginEvent, UserLogoutEvent, UserSessionExpiredEvent, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { InboxCountService } from '../src/services/inbox-count.service';
import { InboxConfigMock } from './inbox.client-config.mock';
import { InboxResourceServiceMock } from './inbox.mocks';

describe('InboxCountService', () => {
    let service: InboxCountService;
    let inboxResourceServiceMock: InboxResourceServiceMock;
    let inboxConfigMock: InboxConfigMock;
    let rtmsServiceMock: RtmsServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let userMock: UserServiceMock;
    let countSpy: jasmine.Spy;

    beforeEach(() => {
        inboxResourceServiceMock = MockContext.useMock(InboxResourceServiceMock);
        inboxConfigMock = MockContext.useMock(InboxConfigMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InboxCountService],
        });

        inboxConfigMock.counterPullInterval = 2000;
        inboxConfigMock.useRtms = false;
        userMock.isAuthenticated = true;
    });

    function initService() {
        service = TestBed.inject(InboxCountService);
        countSpy = jasmine.createSpy();
        inboxConfigMock.whenReady.next();
        service.count.subscribe(countSpy);
    }

    describe('count', () => {
        describe('rtms', () => {
            beforeEach(() => {
                inboxConfigMock.useRtms = true;
            });

            it('should poll from service only once to show initial count', fakeAsync(() => {
                initService();

                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalled();

                inboxResourceServiceMock.getMessagesCount.next({ count: 2 });

                expect(countSpy).toHaveBeenCalledWith(2);

                tick(5000);

                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(1);

                discardPeriodicTasks();
            }));

            it('should notify subscribers when count update message is received', () => {
                initService();

                rtmsServiceMock.messages.next({ type: RtmsType.PLAYERINBOX_UPDATE, payload: { newMsgCount: 2 } } as RtmsMessage);

                expect(countSpy).toHaveBeenCalledWith(2);
            });

            it('should truncate count to 99', () => {
                initService();

                rtmsServiceMock.messages.next({ type: 'PLAYERINBOX_UPDATE', payload: { newMsgCount: 150 } } as RtmsMessage);

                expect(countSpy).toHaveBeenCalledWith(99);
            });
        });

        describe('polling', () => {
            it('should poll in configured interval for count and notify subscribers', fakeAsync(() => {
                initService();

                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalled();

                inboxResourceServiceMock.getMessagesCount.next({ count: 2 });

                expect(countSpy).toHaveBeenCalledWith(2);

                tick(2000);

                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(2);

                inboxResourceServiceMock.getMessagesCount.next({ count: 3 });

                expect(countSpy).toHaveBeenCalledWith(3);

                discardPeriodicTasks();
            }));

            it('should start polling after user logs in', fakeAsync(() => {
                userMock.isAuthenticated = false;
                initService();

                expect(inboxResourceServiceMock.getMessagesCount).not.toHaveBeenCalled();

                userMock.triggerEvent(new UserLoginEvent());

                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalled();
                inboxResourceServiceMock.getMessagesCount.next({ count: 2 });
                expect(countSpy).toHaveBeenCalledWith(2);

                tick(2000);
                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(2);
                inboxResourceServiceMock.getMessagesCount.next({ count: 3 });
                expect(countSpy).toHaveBeenCalledWith(3);

                discardPeriodicTasks();
            }));

            it('should truncate count to 99', fakeAsync(() => {
                initService();

                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalled();
                inboxResourceServiceMock.getMessagesCount.next({ count: 150 });

                expect(countSpy).toHaveBeenCalledWith(99);

                tick(2000);
                expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(2);
                inboxResourceServiceMock.getMessagesCount.next({ count: 200 });
                expect(countSpy).toHaveBeenCalledWith(99);

                discardPeriodicTasks();
            }));

            testStopPolling(new UserSessionExpiredEvent());
            testStopPolling(new UserLogoutEvent());

            function testStopPolling(event: UserEvent) {
                it('should stop polling after user session expires', fakeAsync(() => {
                    initService();

                    countSpy.calls.reset();
                    inboxResourceServiceMock.getMessagesCount.calls.reset();

                    userMock.triggerEvent(event);

                    tick(2000);
                    expect(inboxResourceServiceMock.getMessagesCount).not.toHaveBeenCalled();
                    expect(countSpy).not.toHaveBeenCalled();
                }));
            }
        });
    });

    describe('refresh()', () => {
        it('should poll one time and refresh timer', fakeAsync(() => {
            initService();

            tick(1000);

            service.refresh();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.InboxCountPollInterval);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(
                WorkerType.InboxCountPollInterval,
                { interval: inboxConfigMock.counterPullInterval },
                jasmine.any(Function),
            );
            expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(2);

            inboxResourceServiceMock.getMessagesCount.next({ count: 2 });

            expect(countSpy).toHaveBeenCalledWith(2);

            tick(1500);

            expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(2);

            tick(500);

            expect(inboxResourceServiceMock.getMessagesCount).toHaveBeenCalledTimes(3);

            discardPeriodicTasks();
        }));
    });
});
