import { TimeSpan } from '@frontend/vanilla/core';

describe('TimeSpan', () => {
    runCreateTest('constructor', new TimeSpan(666), 666);
    runCreateTest('fromDays()', TimeSpan.fromDays(1.2, 3.4, 5.6, 7.8, 9), (((1.2 * 24 + 3.4) * 60 + 5.6) * 60 + 7.8) * 1000 + 9);
    runCreateTest('fromHours()', TimeSpan.fromHours(1.2, 3.4, 5.6, 7), ((1.2 * 60 + 3.4) * 60 + 5.6) * 1000 + 7);
    runCreateTest('fromMinutes()', TimeSpan.fromMinutes(1.2, 3.4, 5), (1.2 * 60 + 3.4) * 1000 + 5);
    runCreateTest('fromSeconds()', TimeSpan.fromSeconds(1.2, 3), 1.2 * 1000 + 3);

    function runCreateTest(funcName: string, target: TimeSpan, expected: number) {
        it(`${funcName} should create correctly`, () => expect(target.totalMilliseconds).toBe(expected));
    }

    for (const sign of [1, -1]) {
        const signDesc = sign === 1 ? 'positive' : 'negative';
        describe(`totals should calculate correctly if ${signDesc}`, () => {
            const target = new TimeSpan(sign * 6 * 60 * 60 * 1000);

            it('totalDays', () => expect(target.totalDays).toBe(sign * 0.25));
            it('totalHours', () => expect(target.totalHours).toBe(sign * 6));
            it('totalMinutes', () => expect(target.totalMinutes).toBe(sign * 6 * 60));
            it('totalSeconds', () => expect(target.totalSeconds).toBe(sign * 6 * 60 * 60));
        });

        describe(`components should calculate correctly if ${signDesc}`, () => {
            const target = new TimeSpan(sign * ((((2 * 24 + 3) * 60 + 4) * 60 + 5) * 1000 + 6));

            it('days', () => expect(target.days).toBe(sign * 2));
            it('hours', () => expect(target.hours).toBe(sign * 3));
            it('minutes', () => expect(target.minutes).toBe(sign * 4));
            it('seconds', () => expect(target.seconds).toBe(sign * 5));
            it('milliseconds', () => expect(target.milliseconds).toBe(sign * 6));
        });
    }

    runToStringTest(TimeSpan.ZERO, '00:00:00');
    runToStringTest(new TimeSpan(((13 * 60 + 24) * 60 + 35) * 1000), '13:24:35');
    runToStringTest(new TimeSpan((((2 * 24 + 3) * 60 + 4) * 60 + 5) * 1000), '2.03:04:05');
    runToStringTest(new TimeSpan(9 * 1000 + 1), '00:00:09.001');
    runToStringTest(new TimeSpan(9 * 1000 + 12), '00:00:09.012');
    runToStringTest(new TimeSpan(9 * 1000 + 123), '00:00:09.123');
    runToStringTest(new TimeSpan(-1 * ((((2 * 24 + 3) * 60 + 4) * 60 + 5) * 1000 + 6)), '-2.03:04:05.006');

    function runToStringTest(target: TimeSpan, expected: string) {
        it(`toString() should format to "${expected}"`, () => expect(target.toString()).toBe(expected));
    }
});
