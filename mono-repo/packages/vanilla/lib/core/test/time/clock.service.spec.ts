import { TestBed, fakeAsync } from '@angular/core/testing';

import { ClockService, TimeFormat, TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../src/client-config/test/common-messages.mock';
import { UnitFormat } from '../../src/time/time.models';
import { UserServiceMock } from '../user/user.mock';

describe('ClockService', () => {
    let target: ClockService;
    let userServiceMock: UserServiceMock;
    let staticContent: CommonMessagesMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        staticContent = MockContext.useMock(CommonMessagesMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, ClockService],
        });

        staticContent.Second = 'second';
        staticContent.Minute = 'minute';
        staticContent.Hour = 'hour';
        staticContent.Day = 'day';
        staticContent.Second_short = 's';
        staticContent.Minute_short = 'm';
        staticContent.Hour_short = 'h';
        staticContent.Day_short = 'd';
        staticContent.Second_Plural = 'seconds';
        staticContent.Minute_Plural = 'minutes';
        staticContent.Hour_Plural = 'hours';
        staticContent.Day_Plural = 'days';

        target = TestBed.inject(ClockService);
    });

    it('utcNow should return now with zero offset', fakeAsync(() => {
        expect(target.utcNow.unixMilliseconds).toBe(Date.now());
        expect(target.utcNow.offset).toBe(TimeSpan.ZERO);
    }));

    it('userLocalNow should return now with user timezone offset', fakeAsync(() => {
        userServiceMock.userTimezoneUtcOffset = 135;

        expect(target.userLocalNow.unixMilliseconds).toBe(Date.now());
        expect(target.userLocalNow.offset.totalMilliseconds).toBe(135 * 60 * 1000);
    }));

    describe('toTotalTimeStringFormat', () => {
        it('should return long string', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(130207);
            const result = target.toTotalTimeStringFormat(timeSpan);

            expect(result).toBe('1 day 12 hours 10 minutes 07 seconds');
        }));

        it('should return short string', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(130207);
            const result = target.toTotalTimeStringFormat(timeSpan, { unitFormat: UnitFormat.Short });

            expect(result).toBe('1 d 12 h 10 m 07 s');
        }));

        it('should return short string containing Seconds Part only', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(130207);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                timeFormat: TimeFormat.S,
            });

            expect(result).toBe('07 s');
        }));

        it('should return short string containing Minutes and Seconds Part only', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(130207);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                timeFormat: TimeFormat.MS,
            });

            expect(result).toBe('10 m 07 s');
        }));

        it('should return short string containing Hours Minutes and Seconds Part only', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(130207);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                timeFormat: TimeFormat.HMS,
            });

            expect(result).toBe('12 h 10 m 07 s');
        }));

        it('should return short string containing Days Hours Minutes and Seconds Part only', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(130207);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                timeFormat: TimeFormat.DHMS,
            });

            expect(result).toBe('1 d 12 h 10 m 07 s');
        }));

        it('should return short string containing Hours and Minutes Part even if 0', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(120);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                timeFormat: TimeFormat.HM,
                hideZeros: false,
            });

            expect(result).toBe('0 h 02 m');
        }));

        it('should return short string containing Hours Minutes and Seconds removing trailing 0 values', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(3602);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                timeFormat: TimeFormat.DHMS,
                hideZeros: true,
            });

            expect(result).toBe('1 h 00 m 02 s');
        }));

        it('should return short string only removing trailing 0 values', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(60);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                hideZeros: true,
            });

            expect(result).toBe('01 m');
        }));

        it('should return short string with all parts even if 0', fakeAsync(() => {
            const timeSpan = TimeSpan.fromSeconds(2);
            const result = target.toTotalTimeStringFormat(timeSpan, {
                unitFormat: UnitFormat.Short,
                hideZeros: false,
            });

            expect(result).toBe('0 d 0 h 00 m 02 s');
        }));
    });
});
