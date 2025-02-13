import { TestBed } from '@angular/core/testing';

import { DslRecorderService, TimeSpan, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DateTimeDslValuesProvider } from '../../../../src/dsl/value-providers/time/datetime-dsl-values-provider';
import { WebWorkerServiceMock } from '../../../web-worker/web-worker.service.mock';
import { DslCacheServiceMock } from '../../dsl-cache.mock';
import { ClockServiceMock } from './clock.service.mock';
import { DateTimeDslCalculatorServiceMock } from './datetime-dsl-calculator.service.mock';

describe('DateTimeDslValuesProvider', () => {
    let clockMock: ClockServiceMock;
    let calculatorMock: DateTimeDslCalculatorServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    const worker = new Worker('');

    beforeEach(() => {
        clockMock = MockContext.useMock(ClockServiceMock);
        calculatorMock = MockContext.useMock(DateTimeDslCalculatorServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(DslCacheServiceMock);

        webWorkerServiceMock.createWorker.and.returnValue(worker);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, DateTimeDslValuesProvider],
        });

        TestBed.inject(DslRecorderService).beginRecording();
    });

    function getTarget(): any {
        return TestBed.inject(DateTimeDslValuesProvider).getProviders()['DateTime'];
    }

    describe('init', () => {
        it('should create Web worker', () => {
            getTarget();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.DateTimeDslValuesProviderInterval,
                { interval: 2000 },
                jasmine.any(Function),
            );
        });
    });

    it('Now should pass correct time', () => {
        calculatorMock.getTime.withArgs(clockMock.userLocalNow).and.returnValue(10);
        expect(getTarget()['Now']).toBe(10);
    });

    it('UtcNow should pass correct time', () => {
        calculatorMock.getTime.withArgs(clockMock.utcNow).and.returnValue(11);
        expect(getTarget()['UtcNow']).toBe(11);
    });

    it('Today should pass correct time', () => {
        calculatorMock.getDate.withArgs(clockMock.userLocalNow).and.returnValue(20);
        expect(getTarget()['Today']).toBe(20);
    });

    it('UtcToday should pass correct time', () => {
        calculatorMock.getDate.withArgs(clockMock.utcNow).and.returnValue(21);
        expect(getTarget()['UtcToday']).toBe(21);
    });

    it('TimeOfDay should pass correct time', () => {
        calculatorMock.getTimeOfDay.withArgs(clockMock.userLocalNow).and.returnValue(30);
        expect(getTarget()['TimeOfDay']).toBe(30);
    });

    it('UtcTimeOfDay should pass correct time', () => {
        calculatorMock.getTimeOfDay.withArgs(clockMock.utcNow).and.returnValue(31);
        expect(getTarget()['UtcTimeOfDay']).toBe(31);
    });

    it('DayOfWeek should pass correct time', () => {
        calculatorMock.getDayOfWeek.withArgs(clockMock.userLocalNow).and.returnValue('Caturday');
        expect(getTarget()['DayOfWeek']).toBe('Caturday');
    });

    it('UtcDayOfWeek should pass correct time', () => {
        calculatorMock.getDayOfWeek.withArgs(clockMock.utcNow).and.returnValue('D-Day');
        expect(getTarget()['UtcDayOfWeek']).toBe('D-Day');
    });

    it('DateTime should pass correct time', () => {
        calculatorMock.createTime.withArgs(2000, 1, 2, 3, 4, clockMock.userTimeZoneOffset).and.returnValue(40);
        expect(getTarget()['DateTime'](2000, 1, 2, 3, 4)).toBe(40);
    });

    it('UtcDateTime should pass correct time', () => {
        calculatorMock.createTime.withArgs(2001, 2, 3, 4, 5, TimeSpan.ZERO).and.returnValue(41);
        expect(getTarget()['UtcDateTime'](2001, 2, 3, 4, 5)).toBe(41);
    });

    it('Date should pass correct time', () => {
        calculatorMock.createTime.withArgs(2002, 3, 4, 0, 0, clockMock.userTimeZoneOffset).and.returnValue(50);
        expect(getTarget()['Date'](2002, 3, 4)).toBe(50);
    });

    it('UtcDate should pass correct time', () => {
        calculatorMock.createTime.withArgs(2003, 4, 5, 0, 0, TimeSpan.ZERO).and.returnValue(51);
        expect(getTarget()['UtcDate'](2003, 4, 5)).toBe(51);
    });

    it('Time should pass correct time', () => {
        calculatorMock.createTimeOfDay.withArgs(8, 9).and.returnValue(60);
        expect(getTarget()['Time'](8, 9)).toBe(60);
    });
});
