import { Input, Pipe, PipeTransform } from '@angular/core';

import { ClockService } from './clock.service';
import { TimeSpan } from './time-span';
import { TimeFormat, UnitFormat } from './time.models';

/**
 * @whatItDoes Transforms a Vanilla `TimeSpan` in a string representation of total time in Days Hours Minutes Seconds.
 *
 * @howToUse
 * ```
 * {{ timeSpan | vnTotalTime }}             //Sample output is '2 hours 10 minutes 30 seconds'
 * {{ timeSpan | vnTotalTime:'short' }}     //Sample output is '2 h 10 m 30 s'
 * ```
 *
 * @stable
 */
@Pipe({
    standalone: true,
    name: 'vnTotalTime',
})
export class TotalTimePipe implements PipeTransform {
    @Input() siteKey: string;

    constructor(private clockService: ClockService) {}

    transform(timespan: TimeSpan, displayOption: 'short' | 'long' = 'long', format: string = '', hideZeros: boolean = true): string {
        return this.clockService.toTotalTimeStringFormat(timespan, {
            unitFormat: <UnitFormat>displayOption,
            timeFormat: <TimeFormat>format,
            hideZeros,
        });
    }
}
