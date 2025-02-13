import { Injectable } from '@angular/core';

import { DateTimeOffset } from '../../../time/date-time-offset';
import { TimeSpan } from '../../../time/time-span';

@Injectable({
    providedIn: 'root',
})
export class DslTimeConverterService {
    fromTimeToDsl(time: DateTimeOffset): number {
        return toDsl(time.unixMilliseconds);
    }

    fromDslToTime(dslValue: number): DateTimeOffset {
        return new DateTimeOffset(fromDsl(dslValue), TimeSpan.ZERO);
    }

    fromTimeSpanToDsl(timeSpan: TimeSpan): number {
        return toDsl(timeSpan.totalMilliseconds);
    }

    fromDslToTimeSpan(dslValue: number): TimeSpan {
        return new TimeSpan(fromDsl(dslValue));
    }
}

function toDsl(milliseconds: number): number {
    return Math.trunc(milliseconds / 1000); // trunc instead of round b/c that time hasn't come yet
}

function fromDsl(dslValue: number): number {
    return Math.trunc(dslValue) * 1000;
}
