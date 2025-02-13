import { TestBed } from '@angular/core/testing';

import { TimeSpan, TotalTimePipe } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UnitFormat } from '../../src/time/time.models';
import { ClockServiceMock } from '../dsl/value-providers/time/clock.service.mock';

describe('Pipe: TotalTimePipe', () => {
    let pipe: TotalTimePipe;
    let clockServiceMock: ClockServiceMock;

    beforeEach(() => {
        clockServiceMock = MockContext.useMock(ClockServiceMock);

        TestBed.configureTestingModule({
            providers: [TotalTimePipe, MockContext.providers],
        });

        pipe = TestBed.inject(TotalTimePipe);
    });

    it('should format to long total time', () => {
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('1 hour 02 minutes');

        const timeSpan = TimeSpan.fromMinutes(62);
        const result = pipe.transform(timeSpan);

        expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(timeSpan, {
            unitFormat: UnitFormat.Long,
            timeFormat: '',
            hideZeros: true,
        });
        expect(result).toEqual('1 hour 02 minutes');
    });

    it('should format to short total time', () => {
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('1 h 02 m');

        const timeSpan = TimeSpan.fromMinutes(62);
        const result = pipe.transform(timeSpan, UnitFormat.Short);

        expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(timeSpan, {
            unitFormat: UnitFormat.Short,
            timeFormat: '',
            hideZeros: true,
        });
        expect(result).toEqual('1 h 02 m');
    });

    it('should format with display', () => {
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('1 h 02 m 00 s');

        const timeSpan = TimeSpan.fromMinutes(62);
        const result = pipe.transform(timeSpan, UnitFormat.Short, 'HMS', false);

        expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(timeSpan, {
            unitFormat: UnitFormat.Short,
            timeFormat: 'HMS',
            hideZeros: false,
        });
        expect(result).toEqual('1 h 02 m 00 s');
    });
});
