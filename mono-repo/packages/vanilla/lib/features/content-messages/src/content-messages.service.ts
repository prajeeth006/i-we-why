import { Injectable } from '@angular/core';

import { ContentItem, CookieName, CookieService, SharedFeaturesApiService, toBoolean } from '@frontend/vanilla/core';
import { flatten, isNumber } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentMessagesTrackingService } from './content-messages-tracking.service';

/**
 * @whatItDoes Wraps logic related to content messages esp. manipulation of respective cookies.
 *
 * @description This is meant for Vanilla internal use only!
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ContentMessagesService {
    private messages: { [key: string]: Observable<ContentItem[]> } = {};

    constructor(
        private cookieService: CookieService,
        private api: SharedFeaturesApiService,
        private contentMessagesTrackingService: ContentMessagesTrackingService,
    ) {}

    private static generateExpiryDate(days: string | number | null): Date | undefined {
        if (!days) {
            return;
        }

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + (isNumber(days) ? days : parseInt(days, 10)));

        return expireDate;
    }

    getMessages(
        path: string,
        closedCookieKey?: string,
        evaluateFullOnServer?: boolean,
    ): Observable<ContentItem[] | { [key: string]: ContentItem[] }> {
        if (this.messages[path] || !path) {
            return this.messages[path] || of([]);
        }

        this.messages[path] = this.api
            .get('contentMessages', {
                path,
                closedCookieKey,
                evaluateFullOnServer,
            })
            .pipe(map((r) => r.messages));

        return this.messages[path] || of([]);
    }

    getClosedMessageNames(cookieKey: string): string[] {
        const cookieNames = [CookieName.ClsdP, CookieName.ClsdS, CookieName.ClsdL];

        return flatten(cookieNames.map((c: CookieName) => this.cookieService.getQueryCollection(c, cookieKey)));
    }

    markMessageAsClosed(message: ContentItem, cookieKey: string, options?: { showOnNextSession?: boolean; showOnNextLogin?: boolean }) {
        const parameters = message.parameters || {};
        const showOnNextSession = options?.showOnNextSession === undefined ? toBoolean(parameters.showOnNextSession) : options.showOnNextSession;
        const showOnNextLogin = options?.showOnNextLogin === undefined ? toBoolean(parameters.showOnNextLogin) : options.showOnNextLogin;
        let expires = ContentMessagesService.generateExpiryDate(showOnNextSession ? null : 365); // clsd-l is also persistent b/c delete on login

        if (toBoolean(parameters.writeOriginalCookie) !== false || !parameters.additionalCookieName) {
            const cookieName = showOnNextLogin ? CookieName.ClsdL : showOnNextSession ? CookieName.ClsdS : CookieName.ClsdP;
            this.cookieService.addToQueryCollection(cookieName, cookieKey, message.name, expires ? { expires } : {});
        }

        if (parameters.additionalCookieName) {
            const additionalCookieValue = parameters.additionalCookieValue !== undefined ? parameters.additionalCookieValue : 'true';
            expires =
                parameters.additionalCookieExpireDays !== undefined
                    ? ContentMessagesService.generateExpiryDate(parameters.additionalCookieExpireDays)
                    : expires;

            this.cookieService.putRaw(parameters.additionalCookieName, additionalCookieValue, expires ? { expires } : {});
        }

        this.contentMessagesTrackingService.trackMessageClosed(message);
    }
}
