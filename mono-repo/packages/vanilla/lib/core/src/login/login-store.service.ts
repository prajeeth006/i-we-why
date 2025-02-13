import { Injectable } from '@angular/core';

import { CookieOptions } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';

/**
 * @whatItDoes Provides access to login related features stored in cookies
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginStoreService {
    private prefix: string = 'mobileLogin.';
    private delayPostLoginCCBCookieName: string = 'vn-delayPostLoginCCB';

    /** Gets last visitor */
    get LastVisitor(): string {
        return this.getValue('LastVisitor');
    }

    set LastVisitor(value: string) {
        const expires = this.getExpiration(1);
        this.setValue('LastVisitor', value, { expires });
    }

    /** Gets login type. Identifies login flow i.e. 'oauth' */
    get LoginType(): string | null {
        return this.getValue('LoginType');
    }

    set LoginType(value: string | null) {
        this.setValue('LoginType', value);
    }

    /** Gets last attempted visitor. Indicates the last value that is written in username field on login page. */
    get LastAttemptedVisitor(): string {
        return this.getValue('LastAttemptedVisitor');
    }

    set LastAttemptedVisitor(value: string) {
        this.setValue('LastAttemptedVisitor', value);
    }

    /** if delay of postlogin ccb event is enabled.  */
    get PostLoginCcbEventDelayEnabled(): boolean {
        return this.getValue(this.delayPostLoginCCBCookieName) === '1';
    }

    /** enable post login ccb delay.  */
    enablePostLoginCcbDelay() {
        this.setValue(this.delayPostLoginCCBCookieName, '1');
    }

    /** enable post login ccb delay.  */
    disablePostLoginCcbDelay() {
        this.setValue(this.delayPostLoginCCBCookieName, null);
    }

    /** Gets user's PostLoginValues */
    get PostLoginValues(): { [key: string]: any } | null {
        return this.getValue('PostLoginValues');
    }

    set PostLoginValues(value: { [key: string]: any } | null) {
        this.setValue('PostLoginValues', value);
    }

    /** Gets return url from login */
    get ReturnUrlFromLogin(): any {
        return this.getValue('ReturnUrlFromLogin');
    }

    /** Sets return url from login */
    set ReturnUrlFromLogin(value: any) {
        this.setValue('ReturnUrlFromLogin', value);
    }

    /** Gets selected tab on login */
    get SelectedTab(): string {
        return this.getValue('SelectedTab');
    }

    /** Sets selected tab on login */
    set SelectedTab(value: string) {
        const expires = this.getExpiration(10);
        this.setValue('SelectedTab', value, { expires });
    }

    constructor(private cookieService: CookieService) {}

    private getValue(name: string) {
        const val = this.cookieService.get(this.getKey(name));
        return val ? JSON.parse(val) : val;
    }

    private setValue(name: string, value: any, options?: CookieOptions) {
        if (value == null) {
            this.cookieService.remove(this.getKey(name));
        } else {
            this.cookieService.put(this.getKey(name), JSON.stringify(value), options);
        }
    }

    private getKey(name: string) {
        return this.prefix + name;
    }

    private getExpiration(years: number) {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + years);
        return expires;
    }
}
