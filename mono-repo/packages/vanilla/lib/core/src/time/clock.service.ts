import { Injectable } from '@angular/core';

import { padStart } from 'lodash-es';

import { CommonMessages } from '../client-config/common-messages.client-config';
import { UserService } from '../user/user.service';
import { DateTimeOffset } from './date-time-offset';
import { TimeSpan } from './time-span';
import { ClockOptions, TimeUnit, UnitFormat } from './time.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ClockService {
    constructor(
        private userService: UserService,
        private commonMessages: CommonMessages,
    ) {}

    get utcNow(): DateTimeOffset {
        return ClockService.getNow(TimeSpan.ZERO);
    }

    get userLocalNow(): DateTimeOffset {
        return ClockService.getNow(this.userTimeZoneOffset);
    }

    get userTimeZoneOffset(): TimeSpan {
        return TimeSpan.fromMinutes(this.userService.userTimezoneUtcOffset);
    }

    /**
     * Returns the formatted total time string.
     * @param timeSpan A TimeSpan value to be formatted.
     * @param clockOptions {@see ClockOptions}
     * ```ts
     * clockService.toTotalTimeStringFormat(TimeSpan.fromSeconds(62), { unitFormat: UnitFormat.Short, timeFormat: TimeFormat.MS, hideZeros: false }) // 01 m 02 s
     * ```
     */
    toTotalTimeStringFormat(timeSpan: TimeSpan, clockOptions?: ClockOptions): string {
        const options = {
            timeFormat: '',
            hideZeros: true,
            unitFormat: UnitFormat.Long,
            ...clockOptions,
        };

        const formattedValues = [
            this.formatLong(timeSpan.days, TimeUnit.Day, options.unitFormat, false),
            this.formatLong(timeSpan.hours, TimeUnit.Hour, options.unitFormat, false),
            this.formatLong(timeSpan.minutes, TimeUnit.Minute, options.unitFormat),
            this.formatLong(timeSpan.seconds, TimeUnit.Second, options.unitFormat),
        ];

        if (options.hideZeros) {
            while (formattedValues.length > 1 && formattedValues[0]?.value == 0) {
                formattedValues.splice(0, 1);
            }

            while (formattedValues.length > 1 && formattedValues[formattedValues.length - 1]?.value == 0) {
                formattedValues.splice(formattedValues.length - 1, 1);
            }
        }

        const unitSeparator = options.unitFormat === UnitFormat.Hidden ? ':' : ' ';
        let formattedString = formattedValues.map((x) => x.formatted).join(unitSeparator);

        if (options.timeFormat) {
            const filteredValues = formattedValues.filter((f) => [...options.timeFormat].includes(f.memberLetter));
            formattedString = filteredValues.map((x) => x.formatted).join(unitSeparator);
        }

        return formattedString;
    }

    private formatLong(
        value: number,
        unit: TimeUnit,
        displayOption: UnitFormat,
        zeroPad: boolean = true,
    ): { memberLetter: string; value: number; formatted: string } {
        const truncatedValue = Math.trunc(value);
        const unitKey = unit.toString();
        let unitValue: string;

        if (displayOption === UnitFormat.Hidden) {
            unitValue = '';
        } else if (displayOption == UnitFormat.Short) {
            unitValue = ` ${this.commonMessages[`${unitKey}_short`]}`;
        } else if (truncatedValue > 1) {
            unitValue = ` ${this.commonMessages[`${unitKey}_Plural`]}`;
        } else {
            unitValue = ` ${this.commonMessages[unitKey]}`;
        }

        return {
            memberLetter: unit.charAt(0),
            value: truncatedValue,
            formatted: `${(zeroPad ? padStart(truncatedValue.toString(), 2, '0') : truncatedValue) + unitValue}`,
        };
    }

    private static getNow(offset: TimeSpan): DateTimeOffset {
        return new DateTimeOffset(Date.now(), offset);
    }
}
