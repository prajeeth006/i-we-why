import { TimeSpan, pad } from './time-span';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class DateTimeOffset {
    // There is no way how to enforce particular time zone. It's always adjusted to one of the browser.
    // Trick: We calculate UTC with correct components (hour, minute...) but its UNIX time is invalid.
    private readonly displayUtcDate: Date;

    constructor(
        public readonly unixMilliseconds: number,
        public readonly offset: TimeSpan,
    ) {
        guardOffset(offset);
        this.displayUtcDate = new Date(unixMilliseconds + offset.totalMilliseconds);
    }

    static create(offset: TimeSpan, year: number, month: number, day: number, hour = 0, minute = 0, second = 0, millisecond = 0): DateTimeOffset {
        guardDate(year, month, day);
        guardTimeOfDay(hour, minute, second, millisecond);
        guardOffset(offset);

        // No other way how to construct a Date from a different timezone different from browser's
        const offsetSign = offset.totalMilliseconds >= 0 ? '+' : '-';
        const dateStr = `${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}.${pad(
            millisecond,
            3,
        )}${offsetSign}${pad(offset.hours)}:${pad(offset.minutes)}`;
        const value = Date.parse(dateStr);
        if (isNaN(value)) {
            throw new Error(`Specified values don't represent a valid date time: ${dateStr}`);
        }
        return new DateTimeOffset(value, offset);
    }

    static createTimeOfDay(hour: number, minute: number, second = 0, millisecond = 0): TimeSpan {
        guardTimeOfDay(hour, minute, second, millisecond);
        return TimeSpan.fromHours(hour, minute, second, millisecond);
    }

    get date(): DateTimeOffset {
        const value = this.unixMilliseconds - this.timeOfDay.totalMilliseconds;
        return new DateTimeOffset(value, this.offset);
    }

    get timeOfDay(): TimeSpan {
        return TimeSpan.fromHours(this.hour, this.minute, this.second, this.millisecond);
    }

    get dayOfWeek(): string {
        return DAYS_OF_WEEK[this.displayUtcDate.getUTCDay()]!;
    }

    get year(): number {
        return this.displayUtcDate.getUTCFullYear();
    }

    get month(): number {
        return this.displayUtcDate.getUTCMonth() + 1; // -1 b/c JS returns 0 to 11
    }

    get day(): number {
        return this.displayUtcDate.getUTCDate();
    }

    get hour(): number {
        return this.displayUtcDate.getUTCHours();
    }

    get minute(): number {
        return this.displayUtcDate.getUTCMinutes();
    }

    get second(): number {
        return this.displayUtcDate.getUTCSeconds();
    }

    get millisecond(): number {
        return this.displayUtcDate.getUTCMilliseconds();
    }
}

function guardDate(year: number, month: number, day: number) {
    guardComponent(year, 1000, 3000, 'Year'); // Min/max should be same as on server
    guardComponent(month, 1, 12, 'Month');
    guardComponent(day, 1, daysInMonth(year, month), 'Day');
}

function guardTimeOfDay(hour: number, minute: number, second: number, millisecond: number) {
    guardComponent(hour, 0, 23, 'Hour');
    guardComponent(minute, 0, 59, 'Minute');
    guardComponent(second, 0, 59, 'Second');
    guardComponent(millisecond, 0, 999, 'Millisecond');
}

function guardOffset(offset: TimeSpan) {
    if (offset.totalMinutes % 1 != 0) {
        throw new Error(`Offset must be specified in minutes but it is ${offset}.`);
    }
    if (Math.abs(offset.totalHours) > 14) {
        // 14 is based on .NET DateTimeOffset
        throw new Error(`Absolute offset must be less than or equal to 14 hours but it is ${offset}.`);
    }
}

function guardComponent(value: number, min: number, max: number, componentName: string) {
    if (value % 1 != 0) {
        throw new Error(`${componentName} component of a (date)time must be an integer but specified ${value} has a decimal part.`);
    }
    if (value < min || value > max) {
        throw new Error(
            `${componentName} component of a (date)time must be between ${min} and ${max} (both inclusively) but specified ${value} is out of this range.`,
        );
    }
}

// JavaScript hhas 0-indexed month. Our month if 1-indxed but 0 day means last day of previous month
function daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}
