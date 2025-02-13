import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { SessionLimitsItemComponent } from '../src/session-limits-item.component';
import { SessionLimitType } from '../src/session-limits.models';
import { SessionLimitsConfigMock } from './session-limits.mocks';

describe('SessionLimitsItemComponent', () => {
    let fixture: ComponentFixture<SessionLimitsItemComponent>;
    let sessionLimitsConfigMock: SessionLimitsConfigMock;
    let clockServiceMock: ClockServiceMock;

    beforeEach(() => {
        sessionLimitsConfigMock = MockContext.useMock(SessionLimitsConfigMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        sessionLimitsConfigMock.content = <any>{
            messages: {
                DAILY_LIMIT: 'Daily',
            },
        };
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('1 hour 02 minutes');

        fixture = TestBed.createComponent(SessionLimitsItemComponent);

        fixture.componentRef.setInput('limits', {
            percentageElapsed: 82,
            sessionLimitConfiguredMins: 150,
            sessionLimitElaspedMins: 130,
            sessionLimitType: SessionLimitType.DAILY_LIMIT,
        });

        fixture.detectChanges();
    });

    describe('formattedTimeTemplate', () => {
        it('should return formatted time', () => {
            expect(fixture.componentInstance.formattedTimeTemplate()).toBe(
                `<span class="h4-v2 daily-limit">1</span> <span class="txt-md-v2 daily-limit-timecount">hour</span> <span class="h4-v2 daily-limit">02</span> <span class="txt-md-v2 daily-limit-timecount">minutes</span>`,
            );
        });
    });
});
