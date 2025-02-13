import { DOCUMENT } from '@angular/common';
import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { UserLogoutEvent, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Observable } from 'rxjs';

import { DocumentMock, WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { IdleServiceMock } from '../../../shared/idle/test/idle.mock';
import { ScreenTimeBrowserService } from '../src/screen-time-browser.service';
import { ScreenTimeConfigMock, ScreenTimeResourcesServiceMock } from './screen-time.mock';

describe('ScreenTimeBrowserService', () => {
    let service: ScreenTimeBrowserService;
    let windowMock: WindowMock;
    let screenTimeResourcesServiceMock: ScreenTimeResourcesServiceMock;
    let idleServiceMock: IdleServiceMock;
    let userServiceMock: UserServiceMock;
    let documentMock: DocumentMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        screenTimeResourcesServiceMock = MockContext.useMock(ScreenTimeResourcesServiceMock);
        idleServiceMock = MockContext.useMock(IdleServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        MockContext.useMock(ScreenTimeConfigMock);
        documentMock = new DocumentMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ScreenTimeBrowserService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
    });

    function mockDocumentVisibilityState(visibilityState: 'visible' | 'hidden'): void {
        TestBed.overrideProvider(DOCUMENT, {
            useValue: {
                ...documentMock,
                visibilityState,
            },
        });
        injectAndInitService();
    }

    function injectAndInitService(): void {
        service = TestBed.inject(ScreenTimeBrowserService);
        service.init();
    }

    describe('init', () => {
        it('beforeunload', fakeAsync(() => {
            injectAndInitService();

            expect(idleServiceMock.whenIdle).toHaveBeenCalledWith(6000, { additionalActivityEvent: jasmine.any(Observable) });
            tick(6000);

            const beforeUnloadEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'beforeunload')[0]!.args[1];
            beforeUnloadEvent();

            checkResult(6000);

            discardPeriodicTasks();
        }));

        it('visibilitychange visible subscription', fakeAsync(() => {
            mockDocumentVisibilityState('visible');

            tick(6000);
            const visibilityChangeHiddenEvent = windowMock.document.addEventListener.calls.all().filter((c) => c.args[0] === 'visibilitychange')[0]!
                .args[1];
            visibilityChangeHiddenEvent();

            tick(7000);

            const beforeUnloadEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'beforeunload')[0]!.args[1];
            beforeUnloadEvent();

            checkResult(7000);

            discardPeriodicTasks();
        }));

        it('visibilitychange hidden subscription', fakeAsync(() => {
            // fix: visibilityState mock don't work for HeadlessChrome.
            mockDocumentVisibilityState('hidden');

            tick(6000);
            const visibilityChangeHiddenEvent = windowMock.document.addEventListener.calls.all().filter((c) => c.args[0] === 'visibilitychange')[0]!
                .args[1];
            visibilityChangeHiddenEvent();

            checkResult(6000);

            discardPeriodicTasks();
        }));

        it('pagehide', fakeAsync(() => {
            injectAndInitService();

            tick(6000);

            const pageHideEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'pagehide')[0]!.args[1];
            pageHideEvent();

            checkResult(6000);

            discardPeriodicTasks();
        }));

        it('should not call resource service when screen time is less than minimum screen time', fakeAsync(() => {
            injectAndInitService();

            tick(4000);

            service.browserVisibilityEvent.next(false);

            expect(screenTimeResourcesServiceMock.saveScreenTime).not.toHaveBeenCalled();

            discardPeriodicTasks();
        }));

        it('should save screen time on logout event', fakeAsync(() => {
            injectAndInitService();

            tick(6000);
            idleServiceMock.whenIdle.next();
            userServiceMock.triggerEvent(new UserLogoutEvent());

            checkResult(6000);

            discardPeriodicTasks();
        }));

        describe('idle', () => {
            it('should call api on idle', fakeAsync(() => {
                mockDocumentVisibilityState('visible');

                tick(6000);
                idleServiceMock.whenIdle.next();

                checkResult(6000);

                discardPeriodicTasks();
            }));

            it('should call api on idle when state is hidden', fakeAsync(() => {
                mockDocumentVisibilityState('hidden');

                tick(6000);
                idleServiceMock.whenIdle.next();

                expect(screenTimeResourcesServiceMock.saveScreenTime).not.toHaveBeenCalled();
            }));

            it('should not call api on idle if user is already idle', fakeAsync(() => {
                mockDocumentVisibilityState('visible');

                tick(6000);
                idleServiceMock.whenIdle.next();

                checkResult(6000);

                tick(5000);
                idleServiceMock.whenIdle.next();

                expect(screenTimeResourcesServiceMock.saveScreenTime).not.toHaveBeenCalled();

                discardPeriodicTasks();
            }));

            it('on activity should set start time', fakeAsync(() => {
                mockDocumentVisibilityState('visible');

                idleServiceMock.whenIdle.next();

                tick(5000);

                idleServiceMock.activity.next({});

                tick(6000);
                idleServiceMock.whenIdle.next();

                checkResult(6000);

                discardPeriodicTasks();
            }));
        });
    });

    function checkResult(time: number) {
        const now = new Date();
        expect(screenTimeResourcesServiceMock.saveScreenTime).toHaveBeenCalledWith({
            startTime: new Date(now.getTime() - time),
            screenTime: now,
            mac: '',
        });
        screenTimeResourcesServiceMock.saveScreenTime.calls.reset();
    }
});
