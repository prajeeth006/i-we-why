import { DateTimeOffset, TimeSpan } from '@frontend/vanilla/core';

describe('DateTimeOffset', () => {
    describe('constructor', () => {
        it('should create correctly', () => {
            const offset = TimeSpan.fromMinutes(7);

            const target = new DateTimeOffset(666, offset);

            expect(target.unixMilliseconds).toBe(666);
            expect(target.offset).toBe(offset);
        });

        runThrowTest('not in minutes', new TimeSpan(123000), 'Offset must be specified in minutes but it is 00:02:03.');
        runThrowTest('too low', TimeSpan.fromHours(17), 'Absolute offset must be less than or equal to 14 hours but it is 17:00:00.');
        runThrowTest('too high', TimeSpan.fromHours(-18), 'Absolute offset must be less than or equal to 14 hours but it is -18:00:00.');

        function runThrowTest(conditionDesc: string, offset: TimeSpan, expectedError: string) {
            it('should throw if offset ' + conditionDesc, () => {
                expect(() => new DateTimeOffset(666, offset)).toThrowError(expectedError);
            });
        }
    });

    const validDateTestCases = [
        { name: 'some date', year: 2020, month: 2, day: 3 },
        { name: 'min year', year: 1000, month: 2, day: 3 },
        { name: 'max year', year: 3000, month: 2, day: 3 },
        { name: 'min year', year: 2020, month: 1, day: 3 },
        { name: 'max month', year: 2020, month: 12, day: 3 },
        { name: 'min day', year: 2020, month: 2, day: 1 },
        { name: 'max day', year: 2020, month: 2, day: 29 },
    ];

    const invalidDateTestCases = [
        { year: 2000.1, month: 1, day: 1, error: 'Year component of a (date)time must be an integer but specified 2000.1 has a decimal part.' },
        { year: 2000, month: 1.2, day: 1, error: 'Month component of a (date)time must be an integer but specified 1.2 has a decimal part.' },
        { year: 2000, month: 1, day: 1.3, error: 'Day component of a (date)time must be an integer but specified 1.3 has a decimal part.' },
        {
            year: 666,
            month: 1,
            day: 1,
            error: 'Year component of a (date)time must be between 1000 and 3000 (both inclusively) but specified 666 is out of this range.',
        },
        {
            year: 3500,
            month: 1,
            day: 1,
            error: 'Year component of a (date)time must be between 1000 and 3000 (both inclusively) but specified 3500 is out of this range.',
        },
        {
            year: 2000,
            month: 0,
            day: 1,
            error: 'Month component of a (date)time must be between 1 and 12 (both inclusively) but specified 0 is out of this range.',
        },
        {
            year: 2000,
            month: 13,
            day: 1,
            error: 'Month component of a (date)time must be between 1 and 12 (both inclusively) but specified 13 is out of this range.',
        },
        {
            year: 2000,
            month: 1,
            day: 0,
            error: 'Day component of a (date)time must be between 1 and 31 (both inclusively) but specified 0 is out of this range.',
        },
        {
            year: 2000,
            month: 1,
            day: 32,
            error: 'Day component of a (date)time must be between 1 and 31 (both inclusively) but specified 32 is out of this range.',
        },
    ];

    const validTimeOfDayTestCases = [
        { name: 'sample time of day', hour: 13, minute: 45, second: 12, millisecond: 14 },
        { name: 'min hour', hour: 0, minute: 45, second: 12, millisecond: 14 },
        { name: 'max hour', hour: 23, minute: 45, second: 12, millisecond: 14 },
        { name: 'min minute', hour: 13, minute: 0, second: 12, millisecond: 14 },
        { name: 'max minute', hour: 13, minute: 59, second: 12, millisecond: 14 },
        { name: 'min second', hour: 13, minute: 45, second: 0, millisecond: 14 },
        { name: 'max second', hour: 13, minute: 45, second: 59, millisecond: 14 },
        { name: 'min millisecond', hour: 13, minute: 45, second: 12, millisecond: 0 },
        { name: 'max millisecond', hour: 13, minute: 45, second: 12, millisecond: 999 },
    ];

    const invalidTimeOfDayTestCases = [
        {
            hour: 12.1,
            minute: 1,
            second: 2,
            millisecond: 3,
            error: 'Hour component of a (date)time must be an integer but specified 12.1 has a decimal part.',
        },
        {
            hour: 12,
            minute: 1.3,
            second: 2,
            millisecond: 3,
            error: 'Minute component of a (date)time must be an integer but specified 1.3 has a decimal part.',
        },
        {
            hour: -1,
            minute: 1,
            second: 2,
            millisecond: 3,
            error: 'Hour component of a (date)time must be between 0 and 23 (both inclusively) but specified -1 is out of this range.',
        },
        {
            hour: 24,
            minute: 1,
            second: 2,
            millisecond: 3,
            error: 'Hour component of a (date)time must be between 0 and 23 (both inclusively) but specified 24 is out of this range.',
        },
        {
            hour: 12,
            minute: -1,
            second: 2,
            millisecond: 3,
            error: 'Minute component of a (date)time must be between 0 and 59 (both inclusively) but specified -1 is out of this range.',
        },
        {
            hour: 12,
            minute: 60,
            second: 2,
            millisecond: 3,
            error: 'Minute component of a (date)time must be between 0 and 59 (both inclusively) but specified 60 is out of this range.',
        },
        {
            hour: 12,
            minute: 1,
            second: -1,
            millisecond: 3,
            error: 'Second component of a (date)time must be between 0 and 59 (both inclusively) but specified -1 is out of this range.',
        },
        {
            hour: 12,
            minute: 1,
            second: 60,
            millisecond: 3,
            error: 'Second component of a (date)time must be between 0 and 59 (both inclusively) but specified 60 is out of this range.',
        },
        {
            hour: 12,
            minute: 1,
            second: 2,
            millisecond: -1,
            error: 'Millisecond component of a (date)time must be between 0 and 999 (both inclusively) but specified -1 is out of this range.',
        },
        {
            hour: 12,
            minute: 1,
            second: 2,
            millisecond: 1000,
            error: 'Millisecond component of a (date)time must be between 0 and 999 (both inclusively) but specified 1000 is out of this range.',
        },
    ];

    const validDateTimeTestCases = validDateTestCases
        .map((tc) => ({ hour: 2, minute: 2, second: 2, millisecond: 2, ...tc }))
        .concat(validTimeOfDayTestCases.map((tc) => ({ year: 2000, month: 2, day: 2, ...tc })));

    const invalidDateTimeTestCases = invalidDateTestCases
        .map((tc) => ({ hour: 2, minute: 2, second: 2, millisecond: 2, ...tc }))
        .concat(invalidTimeOfDayTestCases.map((tc) => ({ year: 2000, month: 2, day: 2, ...tc })));

    for (const tc of validDateTimeTestCases) {
        for (const offsetSign of [-1, 1]) {
            it(`create() should create correctly if ${tc.name} and offset sign ${offsetSign}`, () => {
                const offset = TimeSpan.fromHours(offsetSign * 3.75);

                const time = DateTimeOffset.create(offset, tc.year, tc.month, tc.day, tc.hour, tc.minute, tc.second, tc.millisecond);

                // Make sure all components were parsed correctly
                expect(time.offset).toBe(offset);
                expect(time.year).toBe(tc.year);
                expect(time.month).toBe(tc.month);
                expect(time.day).toBe(tc.day);
                expect(time.hour).toBe(tc.hour);
                expect(time.minute).toBe(tc.minute);
                expect(time.second).toBe(tc.second);
                expect(time.millisecond).toBe(tc.millisecond);
            });
        }
    }

    for (const tc of invalidDateTimeTestCases) {
        it(`create() should throw ${tc.error}`, () => {
            expect(() => DateTimeOffset.create(TimeSpan.ZERO, tc.year, tc.month, tc.day, tc.hour, tc.minute, tc.second, tc.millisecond)).toThrowError(
                tc.error,
            );
        });
    }

    for (const tc of validTimeOfDayTestCases) {
        it(`createTimOfDay() should create correctly for ${tc.name}`, () => {
            expect(DateTimeOffset.createTimeOfDay(tc.hour, tc.minute, tc.second, tc.millisecond)).toEqual(
                TimeSpan.fromHours(tc.hour, tc.minute, tc.second, tc.millisecond),
            );
        });
    }

    for (const tc of invalidTimeOfDayTestCases) {
        it(`createTimOfDay() should throw ${tc.error}`, () => {
            expect(() => DateTimeOffset.createTimeOfDay(tc.hour, tc.minute, tc.second, tc.millisecond)).toThrowError(tc.error);
        });
    }

    describe('components should be calculated correctly', () => {
        // 2020-06-02 13:19:56 +02:00
        const offset = TimeSpan.fromHours(2);
        const target = new DateTimeOffset(1591096796988, offset);

        it('date', () => {
            expect(target.date.unixMilliseconds).toBe(1591096796988 - (((13 * 60 + 19) * 60 + 56) * 1000 + 988));
            expect(target.date.offset).toEqual(TimeSpan.fromHours(2));
        });
        it('timeOfDay', () => expect(target.timeOfDay.totalMilliseconds).toBe(47996988));
        it('dayOfWeek', () => expect(target.dayOfWeek).toBe('Tuesday'));
        it('year', () => expect(target.year).toBe(2020));
        it('month', () => expect(target.month).toBe(6));
        it('day', () => expect(target.day).toBe(2));
        it('hour', () => expect(target.hour).toBe(13));
        it('minute', () => expect(target.minute).toBe(19));
        it('second', () => expect(target.second).toBe(56));
        it('millisecond', () => expect(target.millisecond).toBe(988));
    });
});
