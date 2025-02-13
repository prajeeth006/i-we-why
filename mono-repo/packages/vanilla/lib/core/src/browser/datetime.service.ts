import { Injectable } from '@angular/core';

import { UserService } from '../user/user.service';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DateTimeService {
    constructor(private userService: UserService) {}

    now(): Date {
        return new Date();
    }

    convertLocalToUserTimezone(date: Date): Date {
        const dateUTC = date.getTime() + date.getTimezoneOffset() * 60000;

        return new Date(dateUTC + 60000 * this.userService.userTimezoneUtcOffset);
    }

    userTimezoneUtcOffsetTotalSeconds(): number {
        return this.userService.userTimezoneUtcOffset * 60;
    }
}
