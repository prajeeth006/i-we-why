import { FormStyle, TranslationWidth, formatDate, getLocaleDayNames, getLocaleMonthNames } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DatePickerI18nService extends NgbDatepickerI18n {
    private _weekdaysShort: Array<string>;
    private _monthsShort: Array<string>;
    private _monthsFull: Array<string>;

    constructor(@Inject(LOCALE_ID) private _locale: string) {
        super();

        const weekdaysStartingOnSunday = getLocaleDayNames(_locale, FormStyle.Standalone, TranslationWidth.Narrow);
        this._weekdaysShort = weekdaysStartingOnSunday.map((_day, index) => weekdaysStartingOnSunday[(index + 1) % 7]!);

        this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated) as Array<string>;
        this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide) as Array<string>;
    }

    getWeekdayLabel(weekday: number): string {
        return this.getWeekdayShortName(weekday);
    }

    getWeekdayShortName(weekday: number): string {
        return this._weekdaysShort[weekday - 1] || '';
    }

    getMonthShortName(month: number): string {
        return this._monthsShort[month - 1] || '';
    }

    getMonthFullName(month: number): string {
        return this._monthsFull[month - 1] || '';
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return formatDate(jsDate, 'fullDate', this._locale);
    }
}
