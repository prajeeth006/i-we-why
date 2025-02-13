// @dynamic
/**
 * @stable
 */
export class TimeSpan {
    static readonly ZERO = new TimeSpan(0);

    constructor(public readonly totalMilliseconds: number) {}

    get totalDays(): number {
        return this.totalHours / 24;
    }

    get totalHours(): number {
        return this.totalMinutes / 60;
    }

    get totalMinutes(): number {
        return this.totalSeconds / 60;
    }

    get totalSeconds(): number {
        return this.totalMilliseconds / 1000;
    }

    get days(): number {
        return Math.trunc(this.totalDays);
    }

    get hours(): number {
        return Math.trunc(this.totalHours % 24);
    }

    get minutes(): number {
        return Math.trunc(this.totalMinutes % 60);
    }

    get seconds(): number {
        return Math.trunc(this.totalSeconds % 60);
    }

    get milliseconds(): number {
        return this.totalMilliseconds % 1000;
    }

    static fromDays(days: number, hours = 0, minutes = 0, seconds = 0, milliseconds = 0): TimeSpan {
        return TimeSpan.fromHours(days * 24 + hours, minutes, seconds, milliseconds);
    }

    static fromHours(hours: number, minutes = 0, seconds = 0, milliseconds = 0): TimeSpan {
        return TimeSpan.fromMinutes(hours * 60 + minutes, seconds, milliseconds);
    }

    static fromMinutes(minutes: number, seconds = 0, milliseconds = 0): TimeSpan {
        return TimeSpan.fromSeconds(minutes * 60 + seconds, milliseconds);
    }

    static fromSeconds(seconds: number, milliseconds = 0): TimeSpan {
        return new TimeSpan(seconds * 1000 + milliseconds);
    }

    toString(): string {
        const sign = this.totalMilliseconds < 0 ? '-' : '';
        const days = Math.abs(this.days);
        const daysPrefix = days > 0 ? days + '.' : '';
        const milliseconds = Math.abs(this.milliseconds);
        const millisecondsSuffix = milliseconds > 0 ? '.' + pad(milliseconds, 3) : '';
        return `${sign}${daysPrefix}${pad(this.hours)}:${pad(this.minutes)}:${pad(this.seconds)}${millisecondsSuffix}`;
    }
}

export function pad(x: number, size: number = 2): string {
    return ('0000' + Math.abs(x)).slice(-1 * size);
}
