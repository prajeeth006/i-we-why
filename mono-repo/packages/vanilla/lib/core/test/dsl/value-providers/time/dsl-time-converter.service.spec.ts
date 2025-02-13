import { DateTimeOffset, DslTimeConverterService, TimeSpan } from '@frontend/vanilla/core';

describe('DslTimeConverterService', () => {
    const target = new DslTimeConverterService();

    const timeTestCases = [{ time: new DateTimeOffset(1480767900000, TimeSpan.ZERO), dslValue: 1480767900 }];

    describe('fromTimeToDsl() should', () => {
        for (const tc of timeTestCases) {
            runTest(`return unix time ${tc.dslValue}`, tc.time, tc.dslValue);
        }
        runTest('ignore timezone', new DateTimeOffset(1526590800000, TimeSpan.fromHours(3)), 1526590800);
        runTest('truncate milliseconds', new DateTimeOffset(1526595484756, TimeSpan.ZERO), 1526595484);

        function runTest(testName: string, input: DateTimeOffset, expected: number) {
            it(testName, () => expect(target.fromTimeToDsl(input)).toBe(expected));
        }
    });

    describe('fromDslToTime()', () => {
        for (const tc of timeTestCases) {
            runTest(`should convert from unix time ${tc.dslValue}`, tc.dslValue, tc.time);
        }
        runTest('should trunace milliseconds', 1480767900.756, new DateTimeOffset(1480767900000, TimeSpan.ZERO));

        function runTest(testName: string, input: number, expected: DateTimeOffset) {
            it(testName, () => expect(target.fromDslToTime(input)).toEqual(expected));
        }
    });

    const timeSpanTestCases = [
        { timeSpan: TimeSpan.ZERO, dslValue: 0 },
        { timeSpan: TimeSpan.fromHours(5, 45), dslValue: 20700 },
        { timeSpan: TimeSpan.fromSeconds(-66), dslValue: -66 },
    ];

    describe('fromTimeSpanToDsl()', () => {
        for (const tc of timeSpanTestCases) {
            runTest(`should get total seconds ${tc.dslValue}`, tc.timeSpan, tc.dslValue);
        }
        runTest('should truncate milliseconds', TimeSpan.fromSeconds(3.567), 3);

        function runTest(testName: string, input: TimeSpan, expected: number) {
            it(testName, () => expect(target.fromTimeSpanToDsl(input)).toBe(expected));
        }
    });

    describe('fromDslToTimeSpan()', () => {
        for (const tc of timeSpanTestCases) {
            runTest(`should convert from seconds ${tc.dslValue}`, tc.dslValue, tc.timeSpan);
        }
        runTest('should truncate milliseconds', 3.567, TimeSpan.fromSeconds(3));

        function runTest(testName: string, input: number, expected: TimeSpan) {
            it(testName, () => expect(target.fromDslToTimeSpan(input)).toEqual(expected));
        }
    });
});
