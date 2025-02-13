import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TimerServiceMock } from '../../src/browser/timer.mock';
import { RtmsTimerService } from '../../src/rtms/rtms-timer.service';

describe('RtmsTimerService', () => {
    let service: RtmsTimerService;
    let timerServiceMock: TimerServiceMock;
    let operationSpy: jasmine.Spy;

    beforeEach(() => {
        timerServiceMock = MockContext.useMock(TimerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsTimerService],
        });

        operationSpy = jasmine.createSpy('operation');

        service = TestBed.inject(RtmsTimerService);
    });

    describe('setTimeout', () => {
        it('should call timer service', () => {
            service.setTimeout(operationSpy, 10);

            expect(timerServiceMock.setTimeoutOutsideAngularZone).toHaveBeenCalledWith(operationSpy, 10);
        });
    });

    describe('setInterval', () => {
        it('should call timer service', () => {
            service.setInterval(operationSpy, 10);

            expect(timerServiceMock.setIntervalOutsideAngularZone).toHaveBeenCalledWith(operationSpy, 10);
        });
    });

    describe('clearTimeout', () => {
        it('should call timer service', () => {
            service.clearTimeout(1);

            expect(timerServiceMock.clearTimeout).toHaveBeenCalledWith(1);
        });
    });

    describe('clearInterval', () => {
        it('should call timer service', () => {
            service.clearInterval(2);

            expect(timerServiceMock.clearInterval).toHaveBeenCalledWith(2);
        });
    });
});
