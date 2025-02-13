import { TestBed } from '@angular/core/testing';

import { DslRecorderService, TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TimeDslValuesProvider } from '../../../../src/dsl/value-providers/time/time-dsl-values-provider';
import { DslTimeConverterServiceMock } from '../dsl-time-converter.service.mock';

describe('TimeDslValuesProvider', () => {
    let target: any;
    let dslTimeConverter: DslTimeConverterServiceMock;

    beforeEach(() => {
        dslTimeConverter = MockContext.useMock(DslTimeConverterServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, TimeDslValuesProvider],
        });
        TestBed.inject(DslRecorderService).beginRecording();
        target = TestBed.inject(TimeDslValuesProvider).getProviders()['Time'];

        dslTimeConverter.fromTimeSpanToDsl.and.returnValue(666);
    });

    runTest('Seconds', 2, TimeSpan.fromSeconds(2));
    runTest('Minutes', 3, TimeSpan.fromMinutes(3));
    runTest('Hours', 4, TimeSpan.fromHours(4));
    runTest('Days', 5, TimeSpan.fromDays(5));
    runTest('Weeks', 6, TimeSpan.fromDays(6 * 7));
    runTest('Years', 7, TimeSpan.fromDays(7 * 365));

    function runTest(funcName: string, input: number, expected: TimeSpan) {
        it(`${funcName} should calculate timespan correctly`, () => {
            const result = target[funcName](input);

            expect(result).toBe(666);
            expect(dslTimeConverter.fromTimeSpanToDsl.calls.argsFor(0)[0]).toEqual(expected);
        });
    }
});
