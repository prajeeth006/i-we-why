import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { LocalStoreKey, RtmsType, TimeSpan, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { PlayBreakTimerComponent } from '../src/play-break-timer.component';
import { PlayBreakTimer } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakTimerComponent', () => {
    let fixture: ComponentFixture<PlayBreakTimerComponent>;
    let component: PlayBreakTimerComponent;
    let playBreakTrackingServiceMock: PlayBreakTrackingServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let rtmsServiceMock: RtmsServiceMock;
    let playBreakServiceMock: PlayBreakServiceMock;
    let playBreakTimer: PlayBreakTimer;
    let localstorageMock: LocalStoreServiceMock;

    beforeEach(() => {
        playBreakTrackingServiceMock = MockContext.useMock(PlayBreakTrackingServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        localstorageMock = MockContext.useMock(LocalStoreServiceMock);
        MockContext.useMock(PlayBreakConfigMock);
        MockContext.useMock(ClockServiceMock);

        const endTime = new Date();
        endTime.setSeconds(endTime.getSeconds() + 10);
        playBreakTimer = { event: 'time', endTime, playBreakInGc: true };

        TestBed.overrideComponent(PlayBreakTimerComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakTimerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should start the timer on play break timer event and stop when time runs out', fakeAsync(() => {
            playBreakServiceMock.playBreakTimer.next(playBreakTimer);
            tick(TimeSpan.fromSeconds(1).totalMilliseconds);

            expect(component.playBreakTimer).toEqual(playBreakTimer);

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.PlayBreakTimerInterval,
                { interval: 1000 },
                jasmine.any(Function),
            );

            expect(component.remainingTime).toEqual(new TimeSpan(Math.floor(playBreakTimer.endTime.getTime() - new Date().getTime())));
            expect(component.message).toBe('tick');

            // Timer is done
            tick(TimeSpan.fromSeconds(10).totalMilliseconds);

            // TODO: Check how to test web worker callbacks
            // expect(component.message).toBeUndefined();
            const breakType = localstorageMock.get(LocalStoreKey.PlayBreakType) || '';
            expect(
                breakType === ''
                    ? playBreakTrackingServiceMock.trackHeaderMessageShown
                    : playBreakTrackingServiceMock.trackLSL24NotificationPopupDisplayed,
            ).toHaveBeenCalled();

            discardPeriodicTasks();
        }));

        it('should stop timer on play break end RTMS event', fakeAsync(() => {
            playBreakServiceMock.playBreakTimer.next(playBreakTimer);
            tick(TimeSpan.fromSeconds(1).totalMilliseconds);

            rtmsServiceMock.messages.next({
                eventId: '',
                type: RtmsType.PLAY_BREAK_END_EVENT,
                payload: {},
            });

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.PlayBreakTimerInterval);
            expect(component.message).toBeUndefined();

            discardPeriodicTasks();
        }));
    });
});
