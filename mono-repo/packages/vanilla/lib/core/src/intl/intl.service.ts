import { formatCurrency, formatDate, formatNumber, getCurrencySymbol } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

import { Page } from '../client-config/page.client-config';
import { UserService } from '../user/user.service';

/**
 * @stable
 */
export class MonthInfo {
    numeric: number;
    shortName: string;
    longName: string;
}

/**
 * @whatItDoes A helper service that provides utility methods for internationalization.
 *
 * @description
 *
 * ## formatCurrency
 *
 * See [vnCurrency](http://docs.vanilla.intranet/mobile/api/core/CurrencyPipe) for details. Also special
 * `bwin` format is available to format as <amount><space><currencyCode>.
 *
 * ## getMonths
 *
 * Gets a list of months with their long and short names.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class IntlService {
    constructor(
        private user: UserService,
        private page: Page,
        @Inject(LOCALE_ID) private localeId: string,
    ) {}

    formatCurrency(amount: number, currencyCode?: string, digitsInfo?: string): string {
        currencyCode = currencyCode || this.user.currency;
        const display = this.page.currency[currencyCode.toLowerCase()] ?? this.page.currency['default'];
        if (display === 'bwin') {
            digitsInfo = digitsInfo || '1.2-2';
            return `${this.formatNumber(amount, digitsInfo)} ${currencyCode}`;
        } else {
            let currency: string = currencyCode || 'USD';
            if (display !== 'code') {
                currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', this.localeId);
            }

            return formatCurrency(amount, this.localeId, currency, display, digitsInfo);
        }
    }

    formatNumber(amount: number, digitsInfo?: string): string {
        return formatNumber(amount, this.localeId, digitsInfo);
    }

    /**
     If no format is specified, `short` will be used. [Format Options](https://angular.io/api/common/DatePipe#pre-defined-format-options)
     */
    formatDate(date: Date | string | number, format: string = 'short', timezone?: string): string {
        return formatDate(date, format, this.localeId, timezone);
    }

    /**
     If no currency code is specified, user currency code will be used.
     */
    getCurrencySymbol(currencyCode?: string): string {
        return getCurrencySymbol(currencyCode ?? this.user.currency, 'narrow', this.localeId);
    }

    getMonths(): MonthInfo[] {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => {
            const date = new Date(`${index}/11/2009`);
            return {
                numeric: index,
                longName: date.toLocaleString(this.page.culture, { month: 'long' }),
                shortName: date.toLocaleString(this.page.culture, { month: 'short' }),
            };
        });
    }
}
