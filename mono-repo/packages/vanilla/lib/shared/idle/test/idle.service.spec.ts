import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { IdleService } from '@frontend/vanilla/shared/idle';
import { MockContext } from 'moxxi';
import { fromEvent } from 'rxjs';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';

describe('IdleService', () => {
    let service: IdleService;
    let windowMock: WindowMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        MockContext.useMock(PageMock);
        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                IdleService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(IdleService);
    });

    describe('detectActivity', () => {
        const events = ['click', 'keypress'];
        events.forEach((event) => {
            it(
                'should restart timer when event ' + event + ' is triggerd',
                fakeAsync(() => {
                    const idleSpy = jasmine.createSpy('idleSpy');

                    service.whenIdle(500).subscribe(idleSpy);
                    tick(300);

                    const callbackEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === event)[0]!.args[1];
                    callbackEvent();

                    tick(300);

                    expect(idleSpy).not.toHaveBeenCalled();

                    discardPeriodicTasks();
                }),
            );
        });
        events.forEach((event) => {
            it('should detect activity when ' + event + ' is triggerd', () => {
                const activitySpy = jasmine.createSpy('activitySpy');

                service.activity.subscribe(activitySpy);

                const callbackEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === event)[0]!.args[1];
                callbackEvent();

                expect(activitySpy).toHaveBeenCalled();
            });
        });

        it('should wait for first activity to start watch for idle', fakeAsync(() => {
            const idleSpy = jasmine.createSpy('idleSpy');

            service
                .whenIdle(300, {
                    watchForIdleAfterFirstActivity: true,
                })
                .subscribe(idleSpy);

            tick(400);

            expect(idleSpy).not.toHaveBeenCalled();

            const callbackEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'click')[0]!.args[1];
            callbackEvent();

            tick(300);

            expect(idleSpy).toHaveBeenCalled();

            discardPeriodicTasks();
        }));

        it('should restart timer when aditionl event is triggerd', fakeAsync(() => {
            const idleSpy = jasmine.createSpy('idleSpy');

            service
                .whenIdle(500, {
                    additionalActivityEvent: fromEvent(windowMock, 'scroll'),
                })
                .subscribe(idleSpy);

            tick(300);

            const callbackEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'scroll')[0]!.args[1];
            callbackEvent();

            tick(300);

            expect(idleSpy).not.toHaveBeenCalled();

            discardPeriodicTasks();
        }));
    });

    describe('startWatching', () => {
        it('should send notification when timeout expired and there was no user activity', fakeAsync(() => {
            const observableSpy = jasmine.createSpy('observableSpy');

            // start watching
            service.whenIdle(500).subscribe(observableSpy);
            tick(300);

            // only 300 millisecond passed
            expect(observableSpy).not.toHaveBeenCalled();

            tick(100);

            const callbackEvent = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'click')[0]!.args[1];
            callbackEvent();
            tick(300);

            // user clicked, so it prolong the activity
            expect(observableSpy).not.toHaveBeenCalled();

            tick(300);

            // 600 millisecond after last activity
            expect(observableSpy).toHaveBeenCalled();

            discardPeriodicTasks();
        }));
    });
});
