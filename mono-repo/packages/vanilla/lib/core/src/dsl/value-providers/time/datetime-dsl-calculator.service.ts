import { Injectable } from '@angular/core';

import { DateTimeOffset } from '../../../time/date-time-offset';
import { TimeSpan } from '../../../time/time-span';
import { DslTimeConverterService } from './dsl-time-converter.service';

@Injectable({
    providedIn: 'root',
})
export class DateTimeDslCalculatorService {
    constructor(private dslTimeConverter: DslTimeConverterService) {}

    getTime(time: DateTimeOffset): number {
        const value = time.unixMilliseconds - (time.second * 1000 + time.millisecond); // Ignore (milli)seconds b/c there are only methods with minute precesion
        return this.dslTimeConverter.fromTimeToDsl(new DateTimeOffset(value, time.offset));
    }

    getDate(time: DateTimeOffset): number {
        return this.dslTimeConverter.fromTimeToDsl(time.date);
    }

    getTimeOfDay(time: DateTimeOffset): number {
        const timeSpan = TimeSpan.fromHours(time.hour, time.minute); // Ignore (milli)seconds b/c there are only methods with minute precesion
        return this.dslTimeConverter.fromTimeSpanToDsl(timeSpan);
    }

    getDayOfWeek(time: DateTimeOffset): string {
        return time.dayOfWeek;
    }

    createTime(year: number, month: number, day: number, hour: number, minute: number, offset: TimeSpan): number {
        const time = DateTimeOffset.create(offset, year, month, day, hour, minute);
        return this.dslTimeConverter.fromTimeToDsl(time);
    }

    createTimeOfDay(hour: number, decimal: number): number {
        const timeSpan = DateTimeOffset.createTimeOfDay(hour, decimal);
        return this.dslTimeConverter.fromTimeSpanToDsl(timeSpan);
    }
}
