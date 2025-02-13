import { TestBed } from '@angular/core/testing';

import { DateTimeOffset, TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DateTimeDslCalculatorService } from '../../../../../core/src/dsl/value-providers/time/datetime-dsl-calculator.service';
import { DslTimeConverterServiceMock } from '../dsl-time-converter.service.mock';

describe('DateTimeDslCalculatorService', () => {
    let target: DateTimeDslCalculatorService;
    let dslTimeConverter: DslTimeConverterServiceMock;
    const offset = TimeSpan.fromHours(3.75);

    beforeEach(() => {
        dslTimeConverter = MockContext.useMock(DslTimeConverterServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DateTimeDslCalculatorService],
        });
        target = TestBed.inject(DateTimeDslCalculatorService);

        dslTimeConverter.fromTimeToDsl.and.returnValue(666);
        dslTimeConverter.fromTimeSpanToDsl.and.returnValue(777);
    });

    function verifyTime(result: number, expected: DateTimeOffset) {
        expect(result).toBe(666);
        expect(dslTimeConverter.fromTimeToDsl).toHaveBeenCalledWith(expected);
    }

    function verifyTimeSpan(result: number, expected: TimeSpan) {
        expect(result).toBe(777);
        expect(dslTimeConverter.fromTimeSpanToDsl).toHaveBeenCalledWith(expected);
    }

    it('getTime() should truncate seconds and convert', () => {
        const result = target.getTime(DateTimeOffset.create(offset, 2000, 1, 2, 3, 4, 5, 6));
        verifyTime(result, DateTimeOffset.create(offset, 2000, 1, 2, 3, 4));
    });

    it('getDate() should truncate time of day and convert', () => {
        const result = target.getDate(DateTimeOffset.create(offset, 2001, 2, 3, 4, 5, 6, 7));
        verifyTime(result, DateTimeOffset.create(offset, 2001, 2, 3));
    });

    it('getTimeOfDay() should get time of day and convert', () => {
        const result = target.getTimeOfDay(DateTimeOffset.create(offset, 2002, 3, 4, 5, 6, 7, 8));
        verifyTimeSpan(result, TimeSpan.fromHours(5, 6));
    });

    it('getDayOfWeek() should calculate correctly', () => {
        const time = new DateTimeOffset(1041638767008, TimeSpan.fromHours(5));
        expect(target.getDayOfWeek(time)).toBe('Saturday');
    });

    it('createTime() should create correctly and convert', () => {
        const result = target.createTime(2001, 2, 3, 4, 5, offset);
        verifyTime(result, DateTimeOffset.create(offset, 2001, 2, 3, 4, 5));
    });

    it('createTimeOfDay() should create correctly and convert', () => {
        const result = target.createTimeOfDay(12, 35);
        verifyTimeSpan(result, TimeSpan.fromHours(12, 35));
    });
});
