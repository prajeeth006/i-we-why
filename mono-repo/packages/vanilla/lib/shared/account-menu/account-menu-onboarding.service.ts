import { Injectable } from '@angular/core';

import { CookieName, CookieService, DateTimeService, UserLoginEvent, UserLogoutEvent, UserService } from '@frontend/vanilla/core';
import { toNumber } from 'lodash-es';
import { first } from 'rxjs';

/** @stable */
@Injectable({
    providedIn: 'root',
})
export class AccountMenuOnboardingService {
    private get oneYearFromNow(): Date {
        const oneYearFromNow = this.dateTimeService.now();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return oneYearFromNow;
    }

    private _enabled: boolean;

    get enabled(): boolean {
        return this._enabled;
    }

    get isFirstLogin(): boolean {
        return this.enabled && this.loginCount === 1;
    }

    loginCount: number;
    tourStartedLoginCount: number | undefined;
    tourDismissed: boolean;

    constructor(
        private cookieService: CookieService,
        private dateTimeService: DateTimeService,
        private user: UserService,
    ) {}

    init(enabled: boolean) {
        if (!this._enabled) {
            this._enabled = enabled;
            this.loginCount = this.getLoginCount();
            this.tourStartedLoginCount = this.getTourStartedLoginCount();
            this.tourDismissed = this.getTourDismissed();

            if (this.user.isAuthenticated && !this.cookieService.get(CookieName.VnLogin)) {
                if (!this._enabled) return;
                this.incrementLoginCount();
                this.incrementTourStartedLoginCount();
                this.cookieService.put(CookieName.VnLogin, '1');
            }

            this.user.events.pipe(first((e) => e instanceof UserLoginEvent)).subscribe(() => {
                if (!this._enabled) return;
                this.incrementLoginCount();
                this.incrementTourStartedLoginCount();
                this.cookieService.put(CookieName.VnLogin, '1');
            });

            this.user.events.pipe(first((e) => e instanceof UserLogoutEvent)).subscribe(() => {
                this.cookieService.remove(CookieName.VnLogin);
            });
        }
    }

    private getLoginCount() {
        const loginCount = this.cookieService.get(CookieName.VnOlc) ?? '0';
        return toNumber(loginCount);
    }

    private getTourStartedLoginCount(): number | undefined {
        const count = this.cookieService.get(CookieName.VnOtslc);
        return count === undefined ? undefined : toNumber(count);
    }

    private getTourDismissed(): boolean {
        const tourDismissed = this.cookieService.get(CookieName.VnOtd);
        return tourDismissed === '1';
    }

    private incrementLoginCount() {
        const oneYearFromNow = this.oneYearFromNow;
        this.loginCount = this.getLoginCount();
        this.loginCount++;
        this.cookieService.put(CookieName.VnOlc, this.loginCount.toString(), { expires: oneYearFromNow });
    }

    private incrementTourStartedLoginCount() {
        this.tourStartedLoginCount = this.getTourStartedLoginCount();
        if (this.tourStartedLoginCount != undefined) {
            this.saveTourStartedLoginCount(this.tourStartedLoginCount + 1);
            this.tourStartedLoginCount++;
        }
    }

    saveTourStartedLoginCount(count: number) {
        this.cookieService.put(CookieName.VnOtslc, count.toString(), { expires: this.oneYearFromNow });
        this.tourStartedLoginCount = count;
    }

    saveTourCompleted() {
        this.cookieService.put(CookieName.VnOtc, '1', { expires: this.oneYearFromNow });
    }

    saveTourDismissed() {
        this.cookieService.put(CookieName.VnOtd, '1', { expires: this.oneYearFromNow });
        this.tourDismissed = true;
    }
}
