import { TestBed } from '@angular/core/testing';

import { TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UnitFormat } from '../../../core/src/time/time.models';
import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { PlayBreak, PlayBreakAcknowledgeRequest, PlayBreakTimer, PlayBreakWorkflow, PlayBreakWorkflowStep } from '../src/play-break.models';
import { PlayBreakService } from '../src/play-break.service';

describe('PlayBreakService', () => {
    let service: PlayBreakService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let clockServiceMock: ClockServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayBreakService],
        });

        service = TestBed.inject(PlayBreakService);
    });

    describe('load', () => {
        it('should call the API and update playBreak observable once', () => {
            const spy = jasmine.createSpy();
            service.playBreak.subscribe(spy);

            service.load();
            service.load(); // Should load only once

            const playBreak: PlayBreak = {
                playBreak: true,
                playBreakType: 'Test',
                playBreakEndTime: '2021-01-01',
                gracePeriodEndTime: '2021-01-01',
                gracePeriod: true,
                playBreakOpted: true,
            };
            apiServiceMock.get.completeWith(playBreak);

            expect(apiServiceMock.get).toHaveBeenCalledOnceWith('playbreak');
            expect(spy).toHaveBeenCalledWith(playBreak);
        });
    });

    describe('acknowledgePlayBreak', () => {
        it('should call the API with the provided request', () => {
            const request: PlayBreakAcknowledgeRequest = {
                actionName: 'acknowledge',
                cstEventId: '123',
                playBreakDuration: 0,
                afterXMinutes: 0,
            };
            service.acknowledgePlayBreak(request);

            expect(apiServiceMock.post).toHaveBeenCalledOnceWith('playbreak/acknowledge', request);
        });
    });

    describe('startPlayBreakTimer', () => {
        it('should update playBreakTimer observable', () => {
            const spy = jasmine.createSpy();
            service.playBreakTimer.subscribe(spy);

            const timer: PlayBreakTimer = { event: 'time', endTime: new Date() };
            service.startPlayBreakTimer(timer);

            expect(spy).toHaveBeenCalledWith(timer);
        });
    });

    describe('changePlayBreakWorkflow', () => {
        it('should update playBreakWorkflow observable', () => {
            const spy = jasmine.createSpy();
            service.playBreakWorkflow.subscribe(spy);

            const workflow: PlayBreakWorkflow = {
                step: PlayBreakWorkflowStep.StartSelection,
                notification: { cstEventId: '123' },
            };
            service.changePlayBreakWorkflow(workflow);

            expect(spy).toHaveBeenCalledWith(workflow);
        });
    });

    describe('formatTime', () => {
        it('should format time to string', () => {
            const timeSpan = TimeSpan.fromMinutes(1);

            service.formatTime(timeSpan, {
                useShortTime: 'true',
                timeFormat: 'M',
                hideZeros: 'true',
            });

            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledOnceWith(timeSpan, {
                timeFormat: 'M',
                hideZeros: true,
                unitFormat: UnitFormat.Short,
            });
        });
    });
});
