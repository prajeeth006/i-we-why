import { Injectable, NgZone, inject } from '@angular/core';

import { Observable, shareReplay } from 'rxjs';

import { TopLevelCookiesConfig } from '../../client-config/top-level-cookies.client-config';
import { Logger } from '../../logging/logger';
import { safeDecodeURIComponent, safeJsonParse } from '../../utils/convert';
import { WINDOW } from '../window/window.token';
import { CookieOptionsProvider } from './cookie-options-provider';
import { CookieOptions } from './cookie.models';

declare const cookieStore: any;

const PARTS_SEPARATOR = '&';
const KEY_SEPARATOR = '=';
const VALUES_SEPARATOR = '|';
export const PERMANENT_COOKIE_EXPIRATION = new Date(2150, 11, 11);

/**
 * @whatItDoes Manipulates cookies.
 *
 * @description
 *
 * This service inherits from [ngx-cookie](https://github.com/salemdar/ngx-cookie) `CookieService`
 * and adds some `ASP.NET` specific methods.
 *
 * Vanilla out of the box sets default options for written cookies with this service:
 *  - domain - `page.domain`
 *  - path - `/`
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class CookieService {
    private readonly defaultOptions: CookieOptions;
    private cookies: { [name: string]: string };
    private cookieString: string;

    private cookieUpdates$?: Observable<string>;

    private zone = inject(NgZone);

    readonly #window = inject(WINDOW);

    constructor(
        cookieOptionsProvider: CookieOptionsProvider,

        private log: Logger,
        private topLevelCookiesConfig: TopLevelCookiesConfig,
    ) {
        this.defaultOptions = cookieOptionsProvider.options;
    }

    /**
     * Returns the value of given cookie key.
     */
    get(name: string): string {
        return this.readCookie(name);
    }

    /**
     * Returns the deserialized value of given cookie key.
     */
    getObject(name: string): any {
        const value = this.readCookie(name);
        return value ? safeJsonParse(value) : value;
    }

    /**
     * Returns a key value object with all the cookies.
     */
    getAll(): { [name: string]: string } {
        this.loadCookies();
        return Object.assign({}, this.cookies);
    }

    /** Sets a value for given cookie key. */
    put(name: string, value: string, options?: CookieOptions) {
        this.writeCookie(name, value, options);
    }

    /** Serializes and sets a value for given cookie key. */
    putObject(name: string, value: any, options?: CookieOptions) {
        this.writeCookie(name, JSON.stringify(value), options);
    }

    /**
     * Same as `put`, but doesn't use `encodeURIComponent` on `name` and `value`.
     */
    putRaw(name: string, value: string | undefined, options?: CookieOptions) {
        this.writeCookie(name, value, Object.assign(options || {}, { storeUnencoded: true }));
    }

    /**
     * Removes given cookie.
     */
    remove(name: string, options?: CookieOptions) {
        this.writeCookie(name, undefined, options);
    }

    /**
     * Removes all cookies.
     */
    removeAll(options?: CookieOptions) {
        this.loadCookies();

        Object.keys(this.cookies).forEach((name) => {
            this.remove(name, options);
        });
    }

    /**
     * Adds an item to cookie formated as query string (parsable by ASP.NET).
     *
     * E.g.
     *  - existing cookie `xxx` with value `a=b`
     *  - `cookieService.addToQueryCollection('xxx', 'c', 'd');`
     *  - `cookieService.addToQueryCollection('xxx', 'a', 'e');`
     *  - cookie now has value `a=b|e&c=d`
     */
    addToQueryCollection(name: string, key: string, value: string, options?: CookieOptions) {
        const allValues = this.readAllValues(name);
        const query = allValues.get(key);

        if (query) {
            query.push(value);
        } else {
            allValues.set(key, [value]);
        }
        this.writeAllValues(name, allValues, options);
    }

    /**
     * Reads the values for given key stored in the cookie which is formated as query string (parsable by ASP.NET).
     * Example:
     *  - cookie `xxx` with value `p=lol|wtf|omg&q=ee`
     *  - `cookieService.getQueryCollection('xxx', 'p');` returns `['lol', 'wtf', 'omg']`
     *  - `cookieService.getQueryCollection('xxx', 'q');` returns `['ee']`
     *  - `cookieService.getQueryCollection('xxx', 'r');` returns `[]`
     */
    getQueryCollection(name: string, key: string): string[] {
        const allValues = this.readAllValues(name);
        return allValues.get(key) || [];
    }

    private writeCookie(name: string, value: string | null | undefined, options: CookieOptions | undefined) {
        this.topLevelCookiesConfig.whenReady.subscribe(() => {
            if (this.topLevelCookiesConfig.setCookieDomain.cookies.indexOf(name) !== -1) {
                if (!options) options = {};
                options.domain = this.topLevelCookiesConfig.setCookieDomain.domain;
            }

            const opts = (options = Object.assign({}, this.defaultOptions, options));

            let expires: any = opts.expires;

            if (value == null) {
                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
                value = '';
            }

            if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (!opts.storeUnencoded) {
                value = encodeURIComponent(value);
                name = encodeURIComponent(name);
            }

            let str = name + '=' + value;
            str += opts.path ? ';path=' + opts.path : '';
            str += opts.domain ? ';domain=' + opts.domain : '';
            str += expires ? ';expires=' + expires.toUTCString() : '';
            str += opts.secure ? ';secure' : '';
            str += opts.sameSite && opts.sameSite !== 'Unspecified' ? ';SameSite=' + options.sameSite : '';
            str += opts.httpOnly ? ';HttpOnly' : '';

            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
            // - 300 cookies
            // - 20 cookies per unique domain
            // - 4096 bytes per cookie
            const cookieLength = str.length + 1;
            if (cookieLength > 4096) {
                this.log.warn(`Cookie '${name}' possibly not set or overflowed because it was too large (${cookieLength} > 4096 bytes)!`);
            }

            this.#window.document.cookie = str;
        });
    }

    private readCookie(name: string): string {
        this.loadCookies();

        return this.cookies[name]!;
    }

    private loadCookies() {
        const currentCookieString = this.#window.document.cookie;

        if (this.cookieString !== currentCookieString) {
            this.cookieString = currentCookieString;
            this.cookies = {};

            const cookieArray = currentCookieString.split('; ');
            for (let i = 0; i < cookieArray.length; i++) {
                const cookie = cookieArray[i]!;
                const index = cookie.indexOf('=');
                if (index > 0) {
                    // ignore nameless cookies
                    const name = safeDecodeURIComponent(cookie.substring(0, index));
                    // the first value that is seen for a cookie is the most
                    // specific one.  values for the same cookie name that
                    // follow are for less specific paths.
                    if (this.cookies[name] == null) {
                        this.cookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
                    }
                }
            }
        }
    }

    private readAllValues(name: string): Map<string, string[]> {
        const cookieValue = this.get(name) || '';
        const result = new Map<string, string[]>();

        if (cookieValue) {
            for (const part of cookieValue.split(PARTS_SEPARATOR)) {
                const separatorIndex = part.indexOf(KEY_SEPARATOR);
                const key = part.substring(0, separatorIndex);
                const values = part
                    .substring(separatorIndex + 1)
                    .split(VALUES_SEPARATOR)
                    .map((v) => decodeURIComponent(v));
                result.set(key, values);
            }
        }

        return result;
    }

    private writeAllValues(name: string, allValues: Map<string, string[]>, options?: CookieOptions) {
        const rawParts: string[] = [];
        allValues.forEach((values, key) => {
            const rawValues = values.map((v) => encodeURIComponent(v)).join(VALUES_SEPARATOR);
            rawParts.push(key + KEY_SEPARATOR + rawValues);
        });
        this.putRaw(name, rawParts.join(PARTS_SEPARATOR), options);
    }

    getCookieUpdates() {
        if (this.cookieUpdates$) {
            return this.cookieUpdates$;
        }

        this.cookieUpdates$ = this.createCookieUpdatesObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));
        return this.cookieUpdates$;
    }

    private createCookieUpdatesObservable() {
        if ('cookieStore' in this.#window) {
            return new Observable<string>((observer) => {
                const callback = () => observer.next(this.#window.document.cookie);
                cookieStore.addEventListener('change', callback);

                return () => cookieStore.removeEventListener('change', callback);
            });
        } else {
            return this.getCookieUpdateFallback();
        }
    }

    private getCookieUpdateFallback() {
        let lastCookie = this.#window.document.cookie;
        // rename document.cookie to document._cookie, and redefine document.cookie
        const expand = '_cookie';
        const nativeCookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') as PropertyDescriptor;
        Object.defineProperty(Document.prototype, expand, nativeCookieDesc);

        return new Observable<string>((observer) => {
            function checkCurrentValue(currentCookie: string) {
                if (currentCookie !== lastCookie) {
                    lastCookie = currentCookie;
                    observer.next(lastCookie);
                }
            }

            let interval: any;
            this.zone.runOutsideAngular(() => {
                // pool and check for update if happened without accessing js object
                interval = setInterval(() => checkCurrentValue(this.#window.document.cookie), 5000);
            });

            Object.defineProperty(Document.prototype, 'cookie', {
                enumerable: true,
                configurable: true,
                get() {
                    return this[expand];
                },
                set(value) {
                    this[expand] = value;
                    checkCurrentValue(value);
                },
            });

            return () => clearInterval(interval);
        });
    }
}
